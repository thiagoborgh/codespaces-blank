class Measurement < ApplicationRecord
  # Associations
  belongs_to :patient
  belongs_to :consultation, optional: true
  belongs_to :recorded_by, class_name: 'User'

  # Validations
  validates :measurement_date, presence: true
  validates :weight, numericality: { greater_than: 0.5, less_than: 500 }, allow_blank: true
  validates :height, numericality: { greater_than: 30, less_than: 250 }, allow_blank: true
  validates :head_circumference, numericality: { greater_than: 20, less_than: 80 }, allow_blank: true
  validates :abdominal_circumference, numericality: { greater_than: 40, less_than: 200 }, allow_blank: true
  validates :calf_circumference, numericality: { greater_than: 15, less_than: 80 }, allow_blank: true

  # Scopes
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :recent, -> { order(measurement_date: :desc) }
  scope :with_weight, -> { where.not(weight: nil) }
  scope :with_height, -> { where.not(height: nil) }
  scope :with_bmi, -> { where.not(weight: nil, height: nil) }

  # Instance methods
  def bmi
    return nil unless weight && height
    
    height_in_meters = height / 100.0
    (weight / (height_in_meters ** 2)).round(2)
  end

  def bmi_category
    return nil unless bmi

    case bmi
    when 0..18.4
      'underweight'
    when 18.5..24.9
      'normal'
    when 25.0..29.9
      'overweight'
    when 30.0..34.9
      'obesity_1'
    when 35.0..39.9
      'obesity_2'
    else
      'obesity_3'
    end
  end

  def bmi_status_label
    return nil unless bmi_category
    
    I18n.t("measurements.bmi_categories.#{bmi_category}")
  end

  def bmi_badge_color
    case bmi_category
    when 'underweight'
      'info'
    when 'normal'
      'success'
    when 'overweight'
      'warning'
    when 'obesity_1', 'obesity_2', 'obesity_3'
      'danger'
    else
      'secondary'
    end
  end

  def abdominal_circumference_risk
    return nil unless abdominal_circumference && patient

    case patient.sex
    when 'masculino'
      abdominal_circumference >= 102 ? 'high' : 'normal'
    when 'feminino'
      abdominal_circumference >= 88 ? 'high' : 'normal'
    else
      'unknown'
    end
  end

  def weight_change_from_last
    last_measurement = patient.measurements
                             .where.not(weight: nil)
                             .where('measurement_date < ?', measurement_date)
                             .order(measurement_date: :desc)
                             .first

    return nil unless last_measurement&.weight && weight

    (weight - last_measurement.weight).round(2)
  end

  def summary
    parts = []
    parts << "Peso: #{weight}kg" if weight
    parts << "Altura: #{height}cm" if height
    parts << "IMC: #{bmi}" if bmi
    parts << "C.Abd: #{abdominal_circumference}cm" if abdominal_circumference
    
    parts.join(", ")
  end

  def alerts
    alerts = []
    
    case bmi_category
    when 'underweight'
      alerts << "Baixo peso"
    when 'overweight'
      alerts << "Sobrepeso"
    when 'obesity_1', 'obesity_2', 'obesity_3'
      alerts << "Obesidade"
    end

    if abdominal_circumference_risk == 'high'
      alerts << "Circunferência abdominal de risco"
    end

    weight_change = weight_change_from_last
    if weight_change && weight_change.abs >= 5
      if weight_change > 0
        alerts << "Ganho de peso significativo (+#{weight_change}kg)"
      else
        alerts << "Perda de peso significativa (#{weight_change}kg)"
      end
    end

    alerts
  end
end
