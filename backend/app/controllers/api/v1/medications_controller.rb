class Api::V1::MedicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_medication, only: [:show, :update, :destroy]

  # GET /api/v1/medications
  def index
    @medications = Medication.page(params[:page])
                            .per(params[:per_page] || 50)

    if params[:search].present?
      @medications = @medications.where(
        'name ILIKE ? OR generic_name ILIKE ? OR description ILIKE ?',
        "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%"
      )
    end

    if params[:category].present?
      @medications = @medications.where(category: params[:category])
    end

    if params[:active_only] == 'true'
      @medications = @medications.where(active: true)
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@medications),
      meta: pagination_meta(@medications)
    )
  end

  # GET /api/v1/medications/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@medication)
    )
  end

  # POST /api/v1/medications
  def create
    @medication = Medication.new(medication_params)

    if @medication.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@medication),
        message: 'Medicamento criado com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar medicamento.',
        errors: @medication.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/medications/1
  def update
    if @medication.update(medication_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@medication),
        message: 'Medicamento atualizado com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar medicamento.',
        errors: @medication.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/medications/1
  def destroy
    @medication.destroy
    render_success(message: 'Medicamento removido com sucesso.')
  end

  # GET /api/v1/medications/search
  def search
    query = params[:q]
    return render_error(message: 'Parâmetro de busca obrigatório.') if query.blank?

    @medications = Medication.where(active: true)
                            .where(
                              'name ILIKE ? OR generic_name ILIKE ?',
                              "%#{query}%", "%#{query}%"
                            )
                            .limit(20)

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@medications)
    )
  end

  private

  def set_medication
    @medication = Medication.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Medicamento não encontrado.')
  end

  def medication_params
    params.require(:medication).permit(
      :name, :generic_name, :description, :dosage_form, :strength,
      :route_administration, :category, :manufacturer, :active
    )
  end
end
