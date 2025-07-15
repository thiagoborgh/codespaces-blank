class MedicalRecordController < WebController
  before_action :authenticate_user!
  before_action :set_patient
  before_action :set_active_consultation, only: [:show]

  def show
    @consultations = @patient.consultations.includes(:professional, :soap_records).order(created_at: :desc)
    @appointments = @patient.appointments.includes(:professional).order(scheduled_at: :desc)
    @medications = @patient.medications.active.includes(:consultation)
    @allergies = @patient.allergies.active
    @problems = @patient.problems.active
    @vital_signs = @patient.vital_signs.recent.limit(10)
    @measurements = @patient.measurements.recent.limit(10)
    @prescriptions = load_prescriptions
    @exams = load_exams
    @certificates = load_certificates
    @timeline_events = build_complete_timeline
    
    # Se não houver consulta ativa e o parâmetro tab=soap foi passado, criar uma nova consulta
    if !@active_consultation && params[:tab] == 'soap'
      @active_consultation = @patient.consultations.create!(
        professional: current_user,
        consultation_date: Time.current,
        consultation_type: 'general',
        status: 'in_progress'
      )
    end
    
    # Se houver consulta ativa, carregar dados SOAP
    if @active_consultation
      @soap_records = @active_consultation.soap_records.includes(:professional)
      initialize_soap_records if @soap_records.empty?
    end
  end

  def update_soap
    @active_consultation = @patient.consultations.find(params[:consultation_id])
    @soap_records = @active_consultation.soap_records.includes(:professional)
    
    if update_soap_records
      render json: { 
        status: 'success', 
        message: 'SOAP atualizado com sucesso',
        timestamp: Time.current.strftime('%H:%M:%S')
      }
    else
      render json: { 
        status: 'error', 
        message: 'Erro ao atualizar SOAP',
        errors: @soap_records.map(&:errors).flatten
      }
    end
  end

  def create_consultation
    @consultation = @patient.consultations.build(consultation_params)
    @consultation.professional = current_user
    @consultation.consultation_date = Time.current
    @consultation.status = 'in_progress'
    
    if @consultation.save
      redirect_to medical_record_path(@patient, tab: 'soap', consultation_id: @consultation.id),
                  notice: 'Atendimento iniciado com sucesso!'
    else
      redirect_to medical_record_path(@patient), 
                  alert: 'Erro ao iniciar atendimento'
    end
  end

  def finalize_consultation
    @active_consultation = @patient.consultations.find(params[:consultation_id])
    
    if @active_consultation.update(status: 'completed', finished_at: Time.current)
      redirect_to medical_record_path(@patient), 
                  notice: 'Atendimento finalizado com sucesso!'
    else
      redirect_to medical_record_path(@patient, tab: 'soap'), 
                  alert: 'Erro ao finalizar atendimento'
    end
  end

  private

  def set_patient
    @patient = Patient.find(params[:id])
  end

  def set_active_consultation
    # Buscar consulta ativa ou específica
    if params[:consultation_id].present?
      @active_consultation = @patient.consultations.find(params[:consultation_id])
    else
      @active_consultation = @patient.consultations.in_progress.first
    end
  end

  def consultation_params
    params.require(:consultation).permit(:consultation_type, :description)
  end

  def initialize_soap_records
    SoapRecord::SOAP_TYPES.each do |type|
      @active_consultation.soap_records.create!(
        soap_type: type,
        content: '',
        patient: @patient,
        professional: current_user
      )
    end
    @soap_records = @active_consultation.soap_records.includes(:professional)
  end

  def update_soap_records
    success = true
    
    params[:soap_records]&.each do |type, data|
      soap_record = @active_consultation.soap_records.find_by(soap_type: type)
      if soap_record
        success = false unless soap_record.update(soap_params(data))
      end
    end
    
    success
  end

  def soap_params(data)
    permitted = data.permit(:content, :ciap2, :cid10)
    
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

  def load_prescriptions
    # Placeholder - implementar quando model Prescription existir
    []
  end

  def load_exams
    # Placeholder - implementar quando model Exam existir
    []
  end

  def load_certificates
    # Placeholder - implementar quando model Certificate existir
    []
  end

  def build_complete_timeline
    events = []
    
    # Consultas
    @patient.consultations.recent.limit(20).each do |consultation|
      events << {
        date: consultation.created_at,
        type: 'consultation',
        title: "Consulta #{consultation.consultation_type.humanize}",
        description: consultation.description,
        professional: consultation.professional.name,
        badge_class: 'bg-blue-500',
        icon: 'stethoscope',
        consultation_id: consultation.id
      }
    end
    
    # Agendamentos
    @patient.appointments.recent.limit(20).each do |appointment|
      events << {
        date: appointment.scheduled_at,
        type: 'appointment',
        title: 'Agendamento',
        description: appointment.description,
        professional: appointment.professional&.name,
        badge_class: 'bg-green-500',
        icon: 'calendar'
      }
    end
    
    # Medicamentos prescritos
    @patient.medications.recent.limit(10).each do |medication|
      events << {
        date: medication.created_at,
        type: 'medication',
        title: "Medicamento: #{medication.name}",
        description: medication.dosage,
        professional: medication.consultation&.professional&.name,
        badge_class: 'bg-purple-500',
        icon: 'pills'
      }
    end
    
    events.sort_by { |event| event[:date] }.reverse
  end
end
