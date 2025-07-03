class ConsultationMedication < ApplicationRecord
  # Associations
  belongs_to :consultation
  belongs_to :medication

  # Validations
  validates :prescribed_at, presence: true
  validates :dosage, presence: true
  validates :frequency, presence: true

  # Instance methods
  def prescription_details
    "#{medication.name} - #{dosage} - #{frequency}"
  end

  def duration_text
    return "Uso contínuo" unless end_date
    
    duration = (end_date - start_date).to_i
    "#{duration} dias"
  end
end
