class Api::V1::AllergiesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_allergy, only: [:show, :update, :destroy]

  # GET /api/v1/allergies
  def index
    @allergies = Allergy.includes(:patient)
                       .page(params[:page])
                       .per(params[:per_page] || 20)

    if params[:patient_id].present?
      @allergies = @allergies.where(patient_id: params[:patient_id])
    end

    if params[:severity].present?
      @allergies = @allergies.where(severity: params[:severity])
    end

    if params[:allergen_type].present?
      @allergies = @allergies.where(allergen_type: params[:allergen_type])
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@allergies),
      meta: pagination_meta(@allergies)
    )
  end

  # GET /api/v1/allergies/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@allergy)
    )
  end

  # POST /api/v1/allergies
  def create
    @allergy = Allergy.new(allergy_params)

    if @allergy.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@allergy),
        message: 'Alergia criada com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar alergia.',
        errors: @allergy.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/allergies/1
  def update
    if @allergy.update(allergy_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@allergy),
        message: 'Alergia atualizada com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar alergia.',
        errors: @allergy.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/allergies/1
  def destroy
    @allergy.destroy
    render_success(message: 'Alergia removida com sucesso.')
  end

  private

  def set_allergy
    @allergy = Allergy.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Alergia não encontrada.')
  end

  def allergy_params
    params.require(:allergy).permit(
      :patient_id, :allergen_name, :allergen_type, :severity,
      :reaction_description, :onset_date, :notes
    )
  end
end
