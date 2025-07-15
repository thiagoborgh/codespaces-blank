class Problem < ApplicationRecord
  belongs_to :patient
  
  validates :name, presence: true
  validates :ciap2, presence: true
  
  scope :active, -> { where(active: true) }
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  
  def formatted_name
    "#{name} (#{ciap2})"
  end
end
