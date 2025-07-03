class Api::V1::VitalSignsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vital_sign, only: [:show, :update, :destroy]

  # GET /api/v1/vital_signs
  def index
    @vital_signs = VitalSign.includes(:consultation, :patient)
                           .page(params[:page])
                           .per(params[:per_page] || 20)

    if params[:consultation_id].present?
      @vital_signs = @vital_signs.where(consultation_id: params[:consultation_id])
    end

    if params[:patient_id].present?
      @vital_signs = @vital_signs.joins(:consultation)
                                .where(consultations: { patient_id: params[:patient_id] })
    end

    if params[:date_from].present?
      @vital_signs = @vital_signs.where('measured_at >= ?', params[:date_from])
    end

    if params[:date_to].present?
      @vital_signs = @vital_signs.where('measured_at <= ?', params[:date_to])
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@vital_signs),
      meta: pagination_meta(@vital_signs)
    )
  end

  # GET /api/v1/vital_signs/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@vital_sign)
    )
  end

  # POST /api/v1/vital_signs
  def create
    @vital_sign = VitalSign.new(vital_sign_params)

    if @vital_sign.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@vital_sign),
        message: 'Sinais vitais criados com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar sinais vitais.',
        errors: @vital_sign.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/vital_signs/1
  def update
    if @vital_sign.update(vital_sign_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@vital_sign),
        message: 'Sinais vitais atualizados com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar sinais vitais.',
        errors: @vital_sign.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/vital_signs/1
  def destroy
    @vital_sign.destroy
    render_success(message: 'Sinais vitais removidos com sucesso.')
  end

  private

  def set_vital_sign
    @vital_sign = VitalSign.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Sinais vitais não encontrados.')
  end

  def vital_sign_params
    params.require(:vital_sign).permit(
      :consultation_id, :systolic_bp, :diastolic_bp, :heart_rate,
      :respiratory_rate, :temperature, :oxygen_saturation, :weight,
      :height, :measured_at, :notes
    )
  end
end
