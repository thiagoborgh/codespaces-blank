class Api::V1::ConsultationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_consultation, only: [:show, :update, :destroy]

  # GET /api/v1/consultations
  def index
    @consultations = Consultation.includes(:patient, :user, :soap_record, :vital_signs, :medications)
                                .page(params[:page])
                                .per(params[:per_page] || 20)

    if params[:patient_id].present?
      @consultations = @consultations.where(patient_id: params[:patient_id])
    end

    if params[:date_from].present?
      @consultations = @consultations.where('consultation_date >= ?', params[:date_from])
    end

    if params[:date_to].present?
      @consultations = @consultations.where('consultation_date <= ?', params[:date_to])
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@consultations),
      meta: pagination_meta(@consultations)
    )
  end

  # GET /api/v1/consultations/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@consultation, include: ['soap_record', 'vital_signs', 'medications'])
    )
  end

  # POST /api/v1/consultations
  def create
    @consultation = Consultation.new(consultation_params)
    @consultation.user = current_user

    if @consultation.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@consultation),
        message: 'Consulta criada com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar consulta.',
        errors: @consultation.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/consultations/1
  def update
    if @consultation.update(consultation_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@consultation),
        message: 'Consulta atualizada com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar consulta.',
        errors: @consultation.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/consultations/1
  def destroy
    @consultation.destroy
    render_success(message: 'Consulta removida com sucesso.')
  end

  private

  def set_consultation
    @consultation = Consultation.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Consulta não encontrada.')
  end

  def consultation_params
    params.require(:consultation).permit(
      :patient_id, :appointment_id, :consultation_date, :chief_complaint,
      :history_present_illness, :past_medical_history, :medications_current,
      :allergies_known, :social_history, :family_history, :review_systems,
      :physical_examination, :assessment, :plan, :follow_up_instructions,
      :status, :notes
    )
  end
end
