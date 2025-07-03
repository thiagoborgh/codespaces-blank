class Allergy < ApplicationRecord
  # Associations
  belongs_to :patient

  # Validations
  validates :allergen, presence: true
  validates :severity, presence: true
  validates :reaction_type, presence: true

  # Enums
  enum :severity, {
    mild: 0,
    moderate: 1,
    severe: 2,
    critical: 3
  }

  enum :allergen_type, {
    medication: 0,
    food: 1,
    environmental: 2,
    chemical: 3,
    other: 4
  }

  # Scopes
  scope :active, -> { where(active: true) }
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :by_severity, ->(severity) { where(severity: severity) }
  scope :critical, -> { where(severity: [:severe, :critical]) }

  # Instance methods
  def severity_label
    I18n.t("allergies.severities.#{severity}")
  end

  def reaction_type_label
    I18n.t("allergies.reaction_types.#{reaction_type}")
  end

  def badge_color
    case severity
    when 'leve'
      'info'
    when 'moderada'
      'warning'
    when 'grave'
      'danger'
    when 'severa'
      'dark'
    end
  end

  def is_critical?
    grave? || severa?
  end

  def alert_message
    if is_critical?
      "ATENÇÃO: Paciente possui alergia #{severity} a #{allergen}. Reação: #{reaction_type_label}"
    else
      "Alergia #{severity} a #{allergen}"
    end
  end
end
