class AttendanceController < WebController
  before_action :authenticate_user!
  before_action :set_patient, only: [:show, :update]
  before_action :set_consultation, only: [:show, :update]

  def show
    @soap_records = @consultation.soap_records.includes(:professional)
    @timeline_events = build_timeline_events
    @patient_allergies = @patient.allergies.active
    @patient_medications = @patient.medications.active
    @patient_problems = @patient.problems.active
    @vital_signs = @patient.vital_signs.recent.limit(5)
    @measurements = @patient.measurements.recent.limit(5)
    
    # Initialize SOAP records if they don't exist
    initialize_soap_records if @soap_records.empty?
  end

  def update
    @soap_records = @consultation.soap_records.includes(:professional)
    
    if update_soap_records
      render json: { status: 'success', message: 'SOAP atualizado com sucesso' }
    else
      render json: { status: 'error', message: 'Erro ao atualizar SOAP' }
    end
  end

  private

  def set_patient
    @patient = Patient.find(params[:patient_id])
  end

  def set_consultation
    @consultation = @patient.consultations.find(params[:id])
  end

  def initialize_soap_records
    SoapRecord::SOAP_TYPES.each do |type|
      @consultation.soap_records.create!(
        soap_type: type,
        content: '',
        patient: @patient,
        professional: current_user
      )
    end
    @soap_records = @consultation.soap_records.includes(:professional)
  end

  def update_soap_records
    success = true
    
    params[:soap_records]&.each do |type, data|
      soap_record = @consultation.soap_records.find_by(soap_type: type)
      if soap_record
        success = false unless soap_record.update(soap_params(data))
      end
    end
    
    success
  end

  def soap_params(data)
    permitted = data.permit(:content, :ciap2, :cid10)
    
    # Handle specific data structures for each SOAP type
    case data[:soap_type]
    when 'objective'
      permitted.merge!(
        vital_signs_data: data[:vital_signs],
        measurements_data: data[:measurements]
      )
    when 'assessment'
      permitted.merge!(
        problems_data: data[:problems],
        allergies_data: data[:allergies]
      )
    when 'plan'
      permitted.merge!(
        medications_data: data[:medications],
        procedures_data: data[:procedures],
        exams_data: data[:exams]
      )
    end
    
    permitted
  end

  def build_timeline_events
    events = []
    
    # Add consultation events
    @patient.consultations.recent.limit(10).each do |consultation|
      events << {
        date: consultation.created_at,
        type: 'consultation',
        title: "Consulta #{consultation.consultation_type}",
        description: consultation.description,
        badge_class: 'bg-primary'
      }
    end
    
    # Add appointment events
    @patient.appointments.recent.limit(10).each do |appointment|
      events << {
        date: appointment.scheduled_at,
        type: 'appointment',
        title: 'Agendamento',
        description: appointment.description,
        badge_class: 'bg-info'
      }
    end
    
    events.sort_by { |event| event[:date] }.reverse
  end
end
