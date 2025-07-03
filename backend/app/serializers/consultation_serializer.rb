class ConsultationSerializer < ActiveModel::Serializer
  attributes :id, :consultation_date, :chief_complaint, :history_present_illness,
             :past_medical_history, :medications_current, :allergies_known,
             :social_history, :family_history, :review_systems,
             :physical_examination, :assessment, :plan, :follow_up_instructions,
             :status, :notes, :created_at, :updated_at

  belongs_to :patient
  belongs_to :user
  belongs_to :appointment, optional: true
  has_one :soap_record
  has_many :vital_signs
  has_many :consultation_medications
  has_many :medications, through: :consultation_medications

  def consultation_date
    object.consultation_date&.strftime('%Y-%m-%d %H:%M')
  end
end
