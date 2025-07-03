class MeasurementSerializer < ActiveModel::Serializer
  attributes :id, :measurement_type, :value, :unit, :reference_range,
             :measured_at, :notes, :created_at, :updated_at

  belongs_to :patient

  def measured_at
    object.measured_at&.strftime('%Y-%m-%d %H:%M')
  end

  def formatted_value
    "#{object.value} #{object.unit}".strip
  end
end
