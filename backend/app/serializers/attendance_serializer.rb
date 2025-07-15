class AttendanceSerializer < ActiveModel::Serializer
  attributes :id, :consultation_date, :consultation_type, :status, :observations,
             :attendance_type, :conduct, :shared_care, :municipality_participation,
             :participation_form, :health_rationality, :outcome, :print_on_finish,
             :created_at, :updated_at

  belongs_to :patient
  belongs_to :professional
  has_many :soap_records
  has_many :vital_signs
  has_many :measurements
  has_many :consultation_medications

  def consultation_date
    object.consultation_date.strftime('%d/%m/%Y')
  end

  def consultation_type
    object.consultation_type.humanize
  end

  def status
    object.status.humanize
  end
end
