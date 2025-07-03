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

  private

  def valid_cpf
    return unless cpf.present?
    
    unless CPF.valid?(cpf)
      errors.add(:cpf, "não é válido")
    end
  end
end
