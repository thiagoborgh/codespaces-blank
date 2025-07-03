class VitalSignSerializer < ActiveModel::Serializer
  attributes :id, :systolic_bp, :diastolic_bp, :heart_rate,
             :respiratory_rate, :temperature, :oxygen_saturation,
             :weight, :height, :measured_at, :notes,
             :created_at, :updated_at

  belongs_to :consultation

  def measured_at
    object.measured_at&.strftime('%Y-%m-%d %H:%M')
  end

  def blood_pressure
    if object.systolic_bp && object.diastolic_bp
      "#{object.systolic_bp}/#{object.diastolic_bp}"
    end
  end
end
