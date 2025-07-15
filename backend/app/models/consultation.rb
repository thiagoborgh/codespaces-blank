class Consultation < ApplicationRecord
  # Associations
  belongs_to :patient
  belongs_to :professional, class_name: 'User'
  belongs_to :appointment, optional: true
  has_many :soap_records, dependent: :destroy
  has_many :consultation_medications, dependent: :destroy
  has_many :medications, through: :consultation_medications
  has_many :vital_signs, dependent: :destroy
  has_many :measurements, dependent: :destroy

  # Validations
  validates :consultation_date, presence: true
  validates :consultation_type, presence: true
  validates :status, presence: true

  # Enums
  enum :status, {
    started: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3
  }

  # Scopes
  scope :today, -> { where(consultation_date: Date.current) }
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :by_professional, ->(professional_id) { where(professional_id: professional_id) }
  scope :by_type, ->(type) { where(consultation_type: type) }
  scope :finished, -> { where(status: :finalizada) }
  scope :recent, -> { order(created_at: :desc) }
  scope :active, -> { where(active: true) }

  # Instance methods
  def duration
    return nil unless created_at && updated_at
    
    ((updated_at - created_at) / 1.hour).round(2)
  end

  def consultation_type_label
    I18n.t("consultations.types.#{consultation_type}")
  end

  def status_label
    I18n.t("consultations.statuses.#{status}")
  end

  def can_be_edited?
    iniciada? || em_andamento?
  end

  def can_be_finalized?
    iniciada? || em_andamento?
  end

  def has_soap?
    soap_records.any?
  end

  def latest_soap
    soap_records.order(created_at: :desc).first
  end

  def prescribed_medications
    consultation_medications.includes(:medication)
  end

  def recorded_vital_signs
    vital_signs.order(created_at: :desc)
  end

  def recorded_measurements
    measurements.order(created_at: :desc)
  end
end
