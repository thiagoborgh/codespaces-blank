class Api::V1::AttendanceController < ApplicationController
  before_action :authenticate_user!
  before_action :set_consultation, only: [:show, :update_soap, :finalize]

  # GET /api/v1/attendance/:consultation_id
  def show
    @soap_records = @consultation.soap_records.includes(:professional)
    @vital_signs = @consultation.vital_signs.order(created_at: :desc).limit(5)
    @measurements = @consultation.measurements.order(created_at: :desc).limit(5)
    @medications = @consultation.consultation_medications.includes(:medication)
    @patient = @consultation.patient
    
    render_success(
      data: {
        consultation: ActiveModelSerializers::SerializableResource.new(@consultation),
        patient: ActiveModelSerializers::SerializableResource.new(@patient),
        soap_records: ActiveModelSerializers::SerializableResource.new(@soap_records),
        vital_signs: ActiveModelSerializers::SerializableResource.new(@vital_signs),
        measurements: ActiveModelSerializers::SerializableResource.new(@measurements),
        medications: ActiveModelSerializers::SerializableResource.new(@medications),
        timeline: build_timeline
      }
    )
  end

  # POST /api/v1/attendance/:consultation_id/soap
  def update_soap
    soap_section = params[:soap_section]
    soap_data = params[:soap_data]

    case soap_section
    when 'subjective'
      update_subjective(soap_data)
    when 'objective'
      update_objective(soap_data)
    when 'assessment'
      update_assessment(soap_data)
    when 'plan'
      update_plan(soap_data)
    else
      render_error(message: 'Seção SOAP inválida')
      return
    end

    render_success(
      message: 'Seção SOAP atualizada com sucesso',
      data: ActiveModelSerializers::SerializableResource.new(@consultation.soap_records.reload)
    )
  end

  # POST /api/v1/attendance/:consultation_id/finalize
  def finalize
    finalization_data = params[:finalization_data]
    
    @consultation.update!(
      status: :completed,
      observations: finalization_data[:observations],
      attendance_type: finalization_data[:attendance_type],
      conduct: finalization_data[:conduct],
      shared_care: finalization_data[:shared_care],
      municipality_participation: finalization_data[:municipality_participation],
      participation_form: finalization_data[:participation_form],
      health_rationality: finalization_data[:health_rationality],
      outcome: finalization_data[:outcome],
      print_on_finish: finalization_data[:print_on_finish]
    )

    render_success(
      message: 'Atendimento finalizado com sucesso',
      data: ActiveModelSerializers::SerializableResource.new(@consultation)
    )
  end

  private

  def set_consultation
    @consultation = Consultation.includes(:patient, :professional, :soap_records)
                                .find(params[:consultation_id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Consulta não encontrada')
  end

  def update_subjective(data)
    soap_record = find_or_create_soap_record('subjective')
    soap_record.update!(
      content: data[:content],
      vital_signs_data: data[:vital_signs],
      measurements_data: data[:measurements]
    )
  end

  def update_objective(data)
    soap_record = find_or_create_soap_record('objective')
    
    # Atualizar antropometria
    if data[:anthropometry].present?
      create_or_update_measurements(data[:anthropometry])
    end

    # Atualizar sinais vitais
    if data[:vital_signs].present?
      create_or_update_vital_signs(data[:vital_signs])
    end

    # Atualizar marcadores alimentares
    if data[:food_markers].present?
      soap_record.update!(
        content: data[:content],
        measurements_data: data[:food_markers]
      )
    end

    # Atualizar vacinação
    if data[:vaccination].present?
      soap_record.update!(
        content: data[:content],
        procedures_data: data[:vaccination]
      )
    end

    # Atualizar resultados de exames
    if data[:exam_results].present?
      soap_record.update!(
        content: data[:content],
        exams_data: data[:exam_results]
      )
    end
  end

  def update_assessment(data)
    soap_record = find_or_create_soap_record('assessment')
    soap_record.update!(
      content: data[:content],
      medications_data: data[:problems] || [],
      procedures_data: data[:allergies] || []
    )
  end

  def update_plan(data)
    soap_record = find_or_create_soap_record('plan')
    
    # Atualizar intervenções/procedimentos
    if data[:interventions].present?
      soap_record.update!(
        content: data[:content],
        procedures_data: data[:interventions]
      )
    end

    # Atualizar medicamentos
    if data[:medications].present?
      create_or_update_medications(data[:medications])
      soap_record.update!(
        medications_data: data[:medications]
      )
    end

    # Atualizar exames
    if data[:exams].present?
      soap_record.update!(
        exams_data: data[:exams]
      )
    end

    # Atualizar orientações
    if data[:guidance].present?
      soap_record.update!(
        content: data[:content]
      )
    end

    # Atualizar encaminhamentos
    if data[:referrals].present?
      soap_record.update!(
        procedures_data: data[:referrals]
      )
    end
  end

  def find_or_create_soap_record(soap_type)
    @consultation.soap_records.find_or_create_by(
      soap_type: soap_type,
      professional: current_user
    ) do |record|
      record.patient = @consultation.patient
      record.content = ''
    end
  end

  def create_or_update_measurements(anthropometry_data)
    anthropometry_data.each do |type, value|
      next if value.blank?

      @consultation.measurements.find_or_create_by(
        measurement_type: type,
        measured_at: Time.current
      ) do |measurement|
        measurement.value = value
        measurement.unit = get_measurement_unit(type)
      end
    end
  end

  def create_or_update_vital_signs(vital_signs_data)
    vital_signs_data.each do |type, value|
      next if value.blank?

      @consultation.vital_signs.find_or_create_by(
        vital_sign_type: type,
        measured_at: Time.current
      ) do |vital_sign|
        vital_sign.value = value
        vital_sign.unit = get_vital_sign_unit(type)
      end
    end
  end

  def create_or_update_medications(medications_data)
    medications_data.each do |medication_data|
      medication = Medication.find_or_create_by(
        name: medication_data[:name]
      ) do |med|
        med.generic_name = medication_data[:generic_name]
        med.dosage = medication_data[:dosage]
        med.form = medication_data[:form]
      end

      @consultation.consultation_medications.find_or_create_by(
        medication: medication
      ) do |cons_med|
        cons_med.dosage = medication_data[:dosage]
        cons_med.frequency = medication_data[:frequency]
        cons_med.duration = medication_data[:duration]
        cons_med.instructions = medication_data[:instructions]
      end
    end
  end

  def get_measurement_unit(type)
    case type
    when 'weight' then 'kg'
    when 'height' then 'cm'
    when 'bmi' then 'kg/m²'
    when 'waist_circumference' then 'cm'
    when 'head_circumference' then 'cm'
    else ''
    end
  end

  def get_vital_sign_unit(type)
    case type
    when 'systolic_pressure', 'diastolic_pressure' then 'mmHg'
    when 'heart_rate' then 'bpm'
    when 'temperature' then '°C'
    when 'respiratory_rate' then 'rpm'
    when 'oxygen_saturation' then '%'
    else ''
    end
  end

  def build_timeline
    events = []
    
    # Adicionar eventos de consulta
    events << {
      type: 'consultation_started',
      timestamp: @consultation.created_at,
      description: 'Atendimento iniciado',
      professional: @consultation.professional.name
    }

    # Adicionar eventos de SOAP
    @consultation.soap_records.each do |soap|
      events << {
        type: 'soap_updated',
        timestamp: soap.updated_at,
        description: "Seção #{soap.soap_type.humanize} atualizada",
        professional: soap.professional.name
      }
    end

    # Adicionar eventos de medicamentos
    @consultation.consultation_medications.each do |med|
      events << {
        type: 'medication_prescribed',
        timestamp: med.created_at,
        description: "Medicamento prescrito: #{med.medication.name}",
        professional: @consultation.professional.name
      }
    end

    # Adicionar eventos de medições
    @consultation.measurements.each do |measurement|
      events << {
        type: 'measurement_taken',
        timestamp: measurement.measured_at,
        description: "#{measurement.measurement_type.humanize}: #{measurement.value} #{measurement.unit}",
        professional: @consultation.professional.name
      }
    end

    # Ordenar por timestamp
    events.sort_by { |event| event[:timestamp] }.reverse
  end
end
