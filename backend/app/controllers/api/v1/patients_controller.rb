class Api::V1::PatientsController < ApplicationController
  before_action :set_patient, only: [:show, :update, :destroy]

  # GET /api/v1/patients
  def index
    @patients = Patient.includes(:allergies, :medications)
                      .page(params[:page])
                      .per(params[:per_page] || 20)

    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @patients = @patients.where(
        "name ILIKE ? OR cpf = ? OR cns = ?", 
        search_term, params[:search], params[:search]
      )
    end

    @patients = @patients.order(:name)

    render_success({
      patients: ActiveModelSerializers::SerializableResource.new(
        @patients, 
        each_serializer: PatientIndexSerializer
      ).serializable_hash,
      pagination: {
        current_page: @patients.current_page,
        total_pages: @patients.total_pages,
        total_count: @patients.total_count,
        per_page: @patients.limit_value
      }
    })
  end

  # GET /api/v1/patients/1
  def show
    render_success(
      ActiveModelSerializers::SerializableResource.new(
        @patient, 
        serializer: PatientDetailSerializer
      ).serializable_hash
    )
  end

  # POST /api/v1/patients
  def create
    @patient = Patient.new(patient_params)

    if @patient.save
      render_success(
        ActiveModelSerializers::SerializableResource.new(
          @patient, 
          serializer: PatientDetailSerializer
        ).serializable_hash,
        "Paciente criado com sucesso",
        :created
      )
    else
      render_error("Erro ao criar paciente", :unprocessable_entity, @patient.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/patients/1
  def update
    if @patient.update(patient_params)
      render_success(
        ActiveModelSerializers::SerializableResource.new(
          @patient, 
          serializer: PatientDetailSerializer
        ).serializable_hash,
        "Paciente atualizado com sucesso"
      )
    else
      render_error("Erro ao atualizar paciente", :unprocessable_entity, @patient.errors.full_messages)
    end
  end

  # DELETE /api/v1/patients/1
  def destroy
    if @patient.destroy
      render_success(nil, "Paciente removido com sucesso")
    else
      render_error("Erro ao remover paciente", :unprocessable_entity, @patient.errors.full_messages)
    end
  end

  # GET /api/v1/patients/search
  def search
    if params[:term].blank?
      render_error("Termo de busca é obrigatório", :bad_request)
      return
    end

    search_term = "%#{params[:term]}%"
    @patients = Patient.where(
      "name ILIKE ? OR cpf = ? OR cns = ?", 
      search_term, params[:term], params[:term]
    ).limit(10)

    render_success(
      ActiveModelSerializers::SerializableResource.new(
        @patients, 
        each_serializer: PatientSearchSerializer
      ).serializable_hash
    )
  end

  private

  def set_patient
    @patient = Patient.find(params[:id])
  end

  def patient_params
    params.require(:patient).permit(
      :name, :cpf, :cns, :birth_date, :sex, :race, 
      :mother_name, :father_name, :nationality, :birth_state,
      :phone, :contact_phone, :cep, :street_type, :street, 
      :number, :neighborhood, :active
    )
  end
end
