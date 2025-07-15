class Patient < ApplicationRecord
  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :cpf, presence: true, uniqueness: true
  validates :cns, presence: true, length: { is: 15 }
  validates :birth_date, presence: true
  validates :sex, presence: true, inclusion: { in: %w[masculino feminino outro] }
  validates :race, presence: true, inclusion: { 
    in: %w[branca preta parda amarela indigena] 
  }
  validates :nationality, presence: true
  validates :birth_state, presence: true
  validates :phone, presence: true
  validates :contact_phone, presence: true
  validates :cep, presence: true, format: { with: /\A\d{5}-?\d{3}\z/ }
  validates :street_type, presence: true
  validates :street, presence: true
  validates :number, presence: true
  validates :neighborhood, presence: true

  # Custom validation for CPF
  validate :valid_cpf

  # Associations
  has_many :appointments, dependent: :destroy
  has_many :consultations, dependent: :destroy
  has_many :soap_records, dependent: :destroy
  has_many :medications, dependent: :destroy
  has_many :allergies, dependent: :destroy
  has_many :vital_signs, dependent: :destroy
  has_many :measurements, dependent: :destroy
  has_many :vaccinations, dependent: :destroy
  has_many :medical_histories, dependent: :destroy

  # Scopes
  scope :by_name, ->(name) { where("name ILIKE ?", "%#{name}%") }
  scope :by_cpf, ->(cpf) { where(cpf: cpf) }
  scope :by_cns, ->(cns) { where(cns: cns) }

  # Additional scopes for medical records
  scope :recent, -> { order(created_at: :desc) }
  scope :active, -> { where(active: true) }

  # Instance methods
  def age
    return nil unless birth_date
    
    today = Date.current
    age = today.year - birth_date.year
    age -= 1 if today < birth_date + age.years
    age
  end

  def full_address
    "#{street_type} #{street}, #{number} - #{neighborhood}, #{birth_state} - #{cep}"
  end

  def latest_consultation
    consultations.order(created_at: :desc).first
  end

  def active_medications
    medications.where(active: true)
  end

  def known_allergies
    allergies.where(active: true)
  end

  # Additional methods for folha rosto
  def formatted_cpf
    return cpf unless cpf.present?
    cpf.gsub(/(\d{3})(\d{3})(\d{3})(\d{2})/, '\1.\2.\3-\4')
  end

  def gender
    case sex
    when 'masculino'
      'Masculino'
    when 'feminino'
      'Feminino'
    else
      'Outro'
    end
  end

  def address
    full_address
  end

  def responsible_name
    # Assuming these fields exist or will be added
    self[:responsible_name] || 'Não informado'
  end

  def responsible_phone
    self[:responsible_phone]
  end

  def calculate_bmi
    return nil unless weight.present? && height.present?
    weight_kg = weight.to_f
    height_m = height.to_f / 100.0
    return nil if height_m <= 0
    
    bmi = weight_kg / (height_m * height_m)
    bmi.round(2)
  end

  # Medical record associations for folha rosto
  def soap_entries
    soap_records
  end

  def exam_results
    # Assuming this association exists or will be created
    @exam_results ||= OpenStruct.new(
      recent: OpenStruct.new(
        limit: ->(n) { [] }
      )
    )
  end

  def initial_listening_notes
    # Placeholder for initial listening notes
    self[:initial_listening_notes] || 'Nenhuma anotação de escuta inicial'
  end

  def medical_appointments
    appointments
  end

  def scheduled_appointments
    # Assuming this association exists or will be created
    @scheduled_appointments ||= OpenStruct.new(
      upcoming: OpenStruct.new(
        order: ->(field) { [] }
      )
    )
  end

  private

  def valid_cpf
    return unless cpf.present?
    
    unless CPF.valid?(cpf)
      errors.add(:cpf, "não é válido")
    end
  end
end
