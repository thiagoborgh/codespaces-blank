class SoapRecord < ApplicationRecord
  # Associations
  belongs_to :patient
  belongs_to :consultation
  belongs_to :professional, class_name: 'User'

  # Validations
  validates :soap_type, presence: true
  validates :content, presence: true

  # Remove enum as it's not needed for SOAP records

  # JSON fields
  serialize :vital_signs_data, JSON
  serialize :measurements_data, JSON
  serialize :medications_data, JSON
  serialize :exams_data, JSON
  serialize :procedures_data, JSON

  # Scopes
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :by_consultation, ->(consultation_id) { where(consultation_id: consultation_id) }
  scope :by_type, ->(type) { where(soap_type: type) }
  scope :recent, -> { order(created_at: :desc) }

  # Instance methods
  def soap_type_label
    I18n.t("soap.types.#{soap_type}")
  end

  def formatted_content
    case soap_type
    when 'objetivo'
      format_objective_content
    when 'plano'
      format_plan_content
    else
      content
    end
  end

  def has_vital_signs?
    vital_signs_data.present? && vital_signs_data.any?
  end

  def has_measurements?
    measurements_data.present? && measurements_data.any?
  end

  def has_medications?
    medications_data.present? && medications_data.any?
  end

  def has_exams?
    exams_data.present? && exams_data.any?
  end

  def has_procedures?
    procedures_data.present? && procedures_data.any?
  end

  private

  def format_objective_content
    formatted = content.dup
    
    if has_vital_signs?
      formatted += "\n\n--- Sinais Vitais ---\n"
      vital_signs_data.each do |key, value|
        formatted += "#{key.humanize}: #{value}\n"
      end
    end

    if has_measurements?
      formatted += "\n\n--- Medições ---\n"
      measurements_data.each do |key, value|
        formatted += "#{key.humanize}: #{value}\n"
      end
    end

    formatted
  end

  def format_plan_content
    formatted = content.dup

    if has_medications?
      formatted += "\n\n--- Medicamentos Prescritos ---\n"
      medications_data.each do |medication|
        formatted += "• #{medication['name']} - #{medication['dosage']} - #{medication['frequency']}\n"
      end
    end

    if has_exams?
      formatted += "\n\n--- Exames Solicitados ---\n"
      exams_data.each do |exam|
        formatted += "• #{exam['name']} - Prioridade: #{exam['priority']}\n"
      end
    end

    if has_procedures?
      formatted += "\n\n--- Procedimentos ---\n"
      procedures_data.each do |procedure|
        formatted += "• #{procedure['name']} - #{procedure['description']}\n"
      end
    end

    formatted
  end
end
