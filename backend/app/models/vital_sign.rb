class VitalSign < ApplicationRecord
  # Associations
  belongs_to :patient
  belongs_to :consultation, optional: true
  belongs_to :recorded_by, class_name: 'User'

  # Validations
  validates :measurement_date, presence: true
  validates :systolic_pressure, presence: true, numericality: { greater_than: 50, less_than: 300 }
  validates :diastolic_pressure, presence: true, numericality: { greater_than: 30, less_than: 200 }
  validates :heart_rate, presence: true, numericality: { greater_than: 30, less_than: 250 }
  validates :respiratory_rate, numericality: { greater_than: 5, less_than: 50 }, allow_blank: true
  validates :temperature, numericality: { greater_than: 30.0, less_than: 45.0 }, allow_blank: true
  validates :oxygen_saturation, numericality: { greater_than: 50, less_than: 100 }, allow_blank: true

  # Scopes
  scope :by_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :recent, -> { order(measurement_date: :desc) }
  scope :today, -> { where(measurement_date: Date.current) }
  scope :last_week, -> { where(measurement_date: 1.week.ago..Date.current) }

  # Instance methods
  def blood_pressure
    "#{systolic_pressure}/#{diastolic_pressure}"
  end

  def blood_pressure_status
    if systolic_pressure >= 140 || diastolic_pressure >= 90
      'high'
    elsif systolic_pressure <= 90 || diastolic_pressure <= 60
      'low'
    else
      'normal'
    end
  end

  def heart_rate_status
    if heart_rate > 100
      'high'
    elsif heart_rate < 60
      'low'
    else
      'normal'
    end
  end

  def temperature_status
    return 'normal' unless temperature

    if temperature >= 37.8
      'fever'
    elsif temperature <= 35.0
      'hypothermia'
    else
      'normal'
    end
  end

  def oxygen_saturation_status
    return 'normal' unless oxygen_saturation

    if oxygen_saturation < 95
      'low'
    else
      'normal'
    end
  end

  def has_abnormal_values?
    blood_pressure_status != 'normal' ||
    heart_rate_status != 'normal' ||
    temperature_status != 'normal' ||
    oxygen_saturation_status != 'normal'
  end

  def summary
    summary = "PA: #{blood_pressure} mmHg, FC: #{heart_rate} bpm"
    summary += ", FR: #{respiratory_rate} mpm" if respiratory_rate
    summary += ", Temp: #{temperature}°C" if temperature
    summary += ", SatO2: #{oxygen_saturation}%" if oxygen_saturation
    summary
  end

  def alerts
    alerts = []
    
    case blood_pressure_status
    when 'high'
      alerts << "Pressão arterial elevada"
    when 'low'
      alerts << "Pressão arterial baixa"
    end

    case heart_rate_status
    when 'high'
      alerts << "Taquicardia"
    when 'low'
      alerts << "Bradicardia"
    end

    case temperature_status
    when 'fever'
      alerts << "Febre"
    when 'hypothermia'
      alerts << "Hipotermia"
    end

    if oxygen_saturation_status == 'low'
      alerts << "Saturação de oxigênio baixa"
    end

    alerts
  end
end
