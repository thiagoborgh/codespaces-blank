class AppointmentSerializer < ActiveModel::Serializer
  attributes :id, :scheduled_at, :duration_minutes, :appointment_type,
             :status, :notes, :created_at, :updated_at

  belongs_to :patient
  belongs_to :user
  has_one :consultation

  def scheduled_at
    object.scheduled_at&.strftime('%Y-%m-%d %H:%M')
  end

  def patient_name
    object.patient&.name
  end

  def doctor_name
    object.user&.name
  end
end
