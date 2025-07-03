class Medication < ApplicationRecord
  # Associations
  belongs_to :patient
  has_many :consultation_medications, dependent: :destroy
  has_many :consultations, through: :consultation_medications

  # Validations
  validates :name, presence: true
  validates :dosage, presence: true
  validates :frequency, presence: true
  validates :start_date, presence: true

  # Scopes
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :current, -> { where('start_date <= ? AND (end_date IS NULL OR end_date >= ?)', Date.current, Date.current) }

  # Instance methods
  def active?
    return false unless start_date <= Date.current
    return true if end_date.nil?
    
    end_date >= Date.current
  end

  def duration_days
    return nil unless start_date && end_date
    
    (end_date - start_date).to_i
  end

  def remaining_days
    return nil unless end_date
    return 0 if end_date < Date.current
    
    (end_date - Date.current).to_i
  end

  def full_prescription
    prescription = "#{name} - #{dosage}"
    prescription += " - #{frequency}" if frequency.present?
    prescription += " - #{instructions}" if instructions.present?
    prescription
  end

  def status
    if active?
      if end_date && remaining_days <= 7
        'ending_soon'
      else
        'active'
      end
    else
      'inactive'
    end
  end

  def status_label
    I18n.t("medications.statuses.#{status}")
  end

  def badge_color
    case status
    when 'active'
      'success'
    when 'ending_soon'
      'warning'
    when 'inactive'
      'secondary'
    end
  end
end
