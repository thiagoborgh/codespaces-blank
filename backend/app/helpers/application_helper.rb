module ApplicationHelper
  def calculate_age(birth_date)
    return 0 unless birth_date
    
    today = Date.today
    age = today.year - birth_date.year
    age -= 1 if today < birth_date + age.years
    age
  end
  
  def format_date(date)
    return '' unless date
    date.strftime('%d/%m/%Y')
  end
  
  def format_datetime(datetime)
    return '' unless datetime
    datetime.strftime('%d/%m/%Y %H:%M')
  end
  
  def format_cpf(cpf)
    return '' unless cpf
    cpf.gsub(/(\d{3})(\d{3})(\d{3})(\d{2})/, '\1.\2.\3-\4')
  end
  
  def format_phone(phone)
    return '' unless phone
    phone.gsub(/(\d{2})(\d{4,5})(\d{4})/, '(\1) \2-\3')
  end
  
  def badge_class_for_status(status)
    case status.to_s
    when 'active', 'in_progress', 'scheduled'
      'bg-primary'
    when 'completed', 'finished'
      'bg-success'
    when 'cancelled'
      'bg-danger'
    when 'pending'
      'bg-warning'
    else
      'bg-secondary'
    end
  end
  
  def calculate_age_at_date(birth_date, target_date)
    return '' unless birth_date && target_date
    
    age = target_date.year - birth_date.year
    age -= 1 if target_date < birth_date + age.years
    
    months = target_date.month - birth_date.month
    months += 12 if months < 0
    
    "#{age} anos #{months} meses"
  end
  
  def calculate_bmi(weight, height)
    return nil unless weight && height && height > 0
    
    height_m = height.to_f / 100
    bmi = weight.to_f / (height_m * height_m)
    bmi.round(1)
  end
  
  def bmi_status(bmi)
    return { class: 'text-muted', text: 'Não calculado' } unless bmi
    
    case bmi
    when 0..18.4
      { class: 'text-info', text: 'Abaixo do peso' }
    when 18.5..24.9
      { class: 'text-success', text: 'Peso normal' }
    when 25.0..29.9
      { class: 'text-warning', text: 'Sobrepeso' }
    when 30.0..34.9
      { class: 'text-danger', text: 'Obesidade grau I' }
    when 35.0..39.9
      { class: 'text-danger', text: 'Obesidade grau II' }
    else
      { class: 'text-danger', text: 'Obesidade grau III' }
    end
  end
  
  def blood_pressure_status(blood_pressure)
    return { class: 'text-muted', text: 'Não informado' } unless blood_pressure
    
    parts = blood_pressure.split('/')
    return { class: 'text-muted', text: 'Formato inválido' } unless parts.length == 2
    
    systolic = parts[0].to_i
    diastolic = parts[1].to_i
    
    if systolic < 120 && diastolic < 80
      { class: 'text-success', text: 'Normal' }
    elsif systolic < 130 && diastolic < 80
      { class: 'text-warning', text: 'Pressão elevada' }
    elsif (systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)
      { class: 'text-warning', text: 'Hipertensão estágio 1' }
    elsif systolic >= 140 || diastolic >= 90
      { class: 'text-danger', text: 'Hipertensão estágio 2' }
    else
      { class: 'text-danger', text: 'Crise hipertensiva' }
    end
  end
  
  def glycemia_status(value, moment = nil)
    return { class: 'text-muted', text: 'Não informado' } unless value
    
    glucose = value.to_f
    
    case moment&.downcase
    when 'jejum'
      if glucose < 70
        { class: 'text-danger', text: 'Hipoglicemia' }
      elsif glucose <= 99
        { class: 'text-success', text: 'Normal' }
      elsif glucose <= 125
        { class: 'text-warning', text: 'Glicemia alterada' }
      else
        { class: 'text-danger', text: 'Diabetes' }
      end
    when 'pos-prandial', 'pós-prandial'
      if glucose < 70
        { class: 'text-danger', text: 'Hipoglicemia' }
      elsif glucose <= 140
        { class: 'text-success', text: 'Normal' }
      elsif glucose <= 199
        { class: 'text-warning', text: 'Intolerância à glicose' }
      else
        { class: 'text-danger', text: 'Diabetes' }
      end
    else
      if glucose < 70
        { class: 'text-danger', text: 'Hipoglicemia' }
      elsif glucose <= 140
        { class: 'text-success', text: 'Normal' }
      elsif glucose <= 200
        { class: 'text-warning', text: 'Alterado' }
      else
        { class: 'text-danger', text: 'Muito alto' }
      end
    end
  end
  
  def temperature_status(temperature)
    return { class: 'text-muted', text: 'Não informado' } unless temperature
    
    temp = temperature.to_f
    
    if temp < 35.0
      { class: 'text-info', text: 'Hipotermia' }
    elsif temp <= 37.2
      { class: 'text-success', text: 'Normal' }
    elsif temp <= 37.8
      { class: 'text-warning', text: 'Febre baixa' }
    elsif temp <= 39.0
      { class: 'text-warning', text: 'Febre moderada' }
    else
      { class: 'text-danger', text: 'Febre alta' }
    end
  end
  
  def oxygen_saturation_status(saturation)
    return { class: 'text-muted', text: 'Não informado' } unless saturation
    
    sat = saturation.to_f
    
    if sat >= 95
      { class: 'text-success', text: 'Normal' }
    elsif sat >= 90
      { class: 'text-warning', text: 'Baixa' }
    else
      { class: 'text-danger', text: 'Crítica' }
    end
  end
  
  def heart_rate_status(heart_rate, age = nil)
    return { class: 'text-muted', text: 'Não informado' } unless heart_rate
    
    hr = heart_rate.to_i
    
    # Valores normais para adultos (simplificado)
    if hr < 60
      { class: 'text-warning', text: 'Bradicardia' }
    elsif hr <= 100
      { class: 'text-success', text: 'Normal' }
    elsif hr <= 120
      { class: 'text-warning', text: 'Taquicardia leve' }
    else
      { class: 'text-danger', text: 'Taquicardia' }
    end
  end
  
  def consultation_type_badge(type)
    case type&.downcase
    when 'inicial', 'escuta'
      'badge bg-info text-white'
    when 'consulta'
      'badge bg-primary'
    when 'procedimento'
      'badge bg-warning text-dark'
    when 'retorno'
      'badge bg-success'
    else
      'badge bg-secondary'
    end
  end
end