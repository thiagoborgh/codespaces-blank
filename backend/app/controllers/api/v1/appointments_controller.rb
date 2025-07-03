class Api::V1::AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :update, :destroy, :start_consultation]
  before_action :set_patient, only: [:index, :create]

  # GET /api/v1/patients/:patient_id/appointments
  def index
    @appointments = @patient.appointments
                           .includes(:professional, :team)
                           .page(params[:page])
                           .per(params[:per_page] || 20)

    @appointments = filter_appointments(@appointments)
    @appointments = sort_appointments(@appointments)

    render_success({
      appointments: ActiveModelSerializers::SerializableResource.new(
        @appointments, 
        each_serializer: AppointmentSerializer
      ).serializable_hash,
      pagination: pagination_data(@appointments)
    })
  end

  # GET /api/v1/appointments (all appointments - for queue management)
  def queue
    @appointments = Appointment.includes(:patient, :professional, :team)
                              .where(appointment_date: Date.current)
                              .pending

    @appointments = filter_queue_appointments(@appointments)
    @appointments = sort_appointments(@appointments)

    render_success(
      ActiveModelSerializers::SerializableResource.new(
        @appointments, 
        each_serializer: AppointmentQueueSerializer
      ).serializable_hash
    )
  end

  # GET /api/v1/appointments/1
  def show
    render_success(
      ActiveModelSerializers::SerializableResource.new(
        @appointment, 
        serializer: AppointmentDetailSerializer
      ).serializable_hash
    )
  end

  # POST /api/v1/patients/:patient_id/appointments
  def create
    @appointment = @patient.appointments.build(appointment_params)
    @appointment.arrival_time = Time.current if @appointment.arrival_time.blank?

    if @appointment.save
      render_success(
        ActiveModelSerializers::SerializableResource.new(
          @appointment, 
          serializer: AppointmentDetailSerializer
        ).serializable_hash,
        "Agendamento criado com sucesso",
        :created
      )
    else
      render_error("Erro ao criar agendamento", :unprocessable_entity, @appointment.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/appointments/1
  def update
    if @appointment.update(appointment_params)
      render_success(
        ActiveModelSerializers::SerializableResource.new(
          @appointment, 
          serializer: AppointmentDetailSerializer
        ).serializable_hash,
        "Agendamento atualizado com sucesso"
      )
    else
      render_error("Erro ao atualizar agendamento", :unprocessable_entity, @appointment.errors.full_messages)
    end
  end

  # DELETE /api/v1/appointments/1
  def destroy
    if @appointment.destroy
      render_success(nil, "Agendamento removido com sucesso")
    else
      render_error("Erro ao remover agendamento")
    end
  end

  # POST /api/v1/appointments/1/start_consultation
  def start_consultation
    if @appointment.can_start_consultation?
      @appointment.update!(status: :em_atendimento)
      
      consultation = @appointment.patient.consultations.create!(
        professional: current_user,
        appointment: @appointment,
        consultation_date: Time.current,
        consultation_type: determine_consultation_type(@appointment),
        status: :iniciada
      )

      render_success(
        {
          appointment: ActiveModelSerializers::SerializableResource.new(
            @appointment, 
            serializer: AppointmentDetailSerializer
          ).serializable_hash,
          consultation: ActiveModelSerializers::SerializableResource.new(
            consultation, 
            serializer: ConsultationSerializer
          ).serializable_hash
        },
        "Consulta iniciada com sucesso"
      )
    else
      render_error("Não é possível iniciar consulta para este agendamento")
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:id])
  end

  def set_patient
    @patient = Patient.find(params[:patient_id]) if params[:patient_id]
  end

  def appointment_params
    params.require(:appointment).permit(
      :appointment_date, :arrival_time, :status, :vulnerability,
      :service_type, :notes, :professional_id, :team_id
    )
  end

  def filter_appointments(appointments)
    appointments = appointments.where(status: params[:status]) if params[:status].present?
    appointments = appointments.where(service_type: params[:service_type]) if params[:service_type].present?
    appointments = appointments.where(professional_id: params[:professional_id]) if params[:professional_id].present?
    appointments = appointments.where(team_id: params[:team_id]) if params[:team_id].present?
    appointments
  end

  def filter_queue_appointments(appointments)
    appointments = appointments.where(professional_id: current_user.id) if params[:my_appointments] == 'true'
    appointments = appointments.where(status: params[:status]) if params[:status].present?
    appointments = appointments.where(service_type: params[:service_type]) if params[:service_type].present?
    appointments
  end

  def sort_appointments(appointments)
    case params[:sort_by]
    when 'risk'
      appointments.ordered_by_risk
    when 'arrival'
      appointments.ordered_by_arrival
    else
      appointments.ordered_by_arrival
    end
  end

  def determine_consultation_type(appointment)
    case appointment.service_type
    when 'escuta_inicial'
      :escuta_inicial
    when 'odontologia'
      :consulta_odontologica
    when 'vacina'
      :vacinacao
    when 'procedimentos', 'curativo', 'nebulizacao'
      :procedimento
    else
      :consulta_medica
    end
  end

  def pagination_data(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
