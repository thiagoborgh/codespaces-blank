# Seeds para teste da folha rosto
puts "🌱 Iniciando seeds..."

# Criar equipe padrão
team = Team.find_or_create_by(name: 'Equipe Principal') do |t|
  t.description = 'Equipe principal do centro de saúde'
  t.active = true
end

puts "✅ Equipe criada: #{team.name}"

# Criar usuário administrador
admin = User.find_or_create_by(email: 'admin@prontuario.com') do |user|
  user.name = 'Administrador do Sistema'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = 'admin'
  user.registration_number = 'ADMIN001'
end

puts "✅ Admin criado: #{admin.email}"

# Criar médico
doctor = User.find_or_create_by(email: 'dr.silva@prontuario.com') do |user|
  user.name = 'Dr. João Silva'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = 'doctor'
  user.registration_number = 'CRM12345'
  user.team = team
end

puts "✅ Médico criado: #{doctor.name}"

# Seeds para testar a interface SOAP

# Criar usuário de teste
user = User.find_or_create_by(email: 'medico@teste.com') do |u|
  u.name = 'Dr. João Silva'
  u.password = 'password123'
  u.role = 'doctor'
  u.registration_number = 'CRM12345'
end

puts "✅ Usuário criado: #{user.name}"

# Criar paciente de teste
patient = Patient.find_or_create_by(cpf: '12345678901') do |p|
  p.name = 'Maria Santos'
  p.cns = '123456789012345'
  p.birth_date = Date.new(1985, 5, 15)
  p.sex = 'feminino'
  p.race = 'parda'
  p.nationality = 'brasileira'
  p.birth_state = 'SP'
  p.phone = '11999999999'
  p.contact_phone = '11999999999'
  p.cep = '01234-567'
  p.street_type = 'Rua'
  p.street = 'das Flores'
  p.number = '123'
  p.neighborhood = 'Centro'
end

puts "✅ Paciente criado: #{patient.name}"

# Criar consulta de teste
consultation = Consultation.find_or_create_by(
  patient: patient,
  professional: doctor,
  consultation_date: Time.current
) do |c|
  c.consultation_type = 'routine'
  c.status = 'started'
end

puts "✅ Consulta criada: #{consultation.id}"

# Criar alguns registros SOAP de exemplo
SoapRecord::SOAP_TYPES.each do |type|
  soap_record = SoapRecord.find_or_create_by(
    consultation: consultation,
    patient: patient,
    professional: user,
    soap_type: type
  ) do |s|
    s.content = case type
                when 'subjective'
                  'Paciente relata dor de cabeça há 2 dias, sem febre associada.'
                when 'objective'
                  'Paciente alerta, orientado, PA: 140/90 mmHg, FC: 72 bpm, Tax: 36.5°C'
                when 'assessment'
                  'Cefaleia tensional. Hipertensão arterial controlada.'
                when 'plan'
                  'Dipirona 500mg, 1 comprimido 6/6h por 3 dias. Retorno em 1 semana.'
                end
  end
  puts "✅ SOAP #{type} criado: #{soap_record.id}"
end

# Create test patient for folha rosto
test_patient = Patient.find_or_create_by(cpf: '12345678901') do |p|
  p.name = 'João Silva Santos'
  p.cns = '123456789012345'
  p.birth_date = Date.new(1990, 5, 15)
  p.sex = 'masculino'
  p.race = 'branca'
  p.nationality = 'brasileiro'
  p.birth_state = 'SP'
  p.phone = '(11) 99999-9999'
  p.contact_phone = '(11) 99999-9999'
  p.cep = '01234-567'
  p.street_type = 'Rua'
  p.street = 'das Flores'
  p.number = '123'
  p.neighborhood = 'Centro'
  p.weight = 75.5
  p.height = 175
  p.blood_pressure = '120/80'
  p.heart_rate = '75'
  p.temperature = '36.5'
  p.oxygen_saturation = '98%'
  p.responsible_name = 'Maria Silva Santos'
  p.responsible_phone = '(11) 88888-8888'
  p.initial_listening_notes = 'Paciente relata dor de cabeça há 2 dias. Histórico de hipertensão familiar.'
end

puts "✅ Paciente de teste criado: #{test_patient.name} - ID: #{test_patient.id}"

# Create sample SOAP records
unless test_patient.soap_records.any?
  test_patient.soap_records.create!(
    subjective: 'Paciente relata dor de cabeça há 2 dias, localizada na região temporal direita.',
    objective: 'PA: 130/85 mmHg, FC: 78 bpm, Tax: 36.2°C. Paciente alerta, orientado.',
    assessment: 'Cefaleia tensional. Hipertensão arterial leve.',
    plan: 'Prescrição de analgésico. Orientações sobre higiene do sono. Retorno em 7 dias.',
    doctor_name: 'Dr. João Medico',
    created_at: 2.days.ago
  )

  test_patient.soap_records.create!(
    subjective: 'Paciente retorna referindo melhora da cefaleia após medicação.',
    objective: 'PA: 125/80 mmHg, FC: 72 bpm, Tax: 36.0°C. Bom estado geral.',
    assessment: 'Melhora do quadro de cefaleia. Pressão arterial controlada.',
    plan: 'Manter medicação atual. Agendar consulta de rotina em 30 dias.',
    doctor_name: 'Dr. João Medico',
    created_at: 1.day.ago
  )
end

puts "✅ SOAP records de teste criados"

puts "🎉 Seeds básicos criados com sucesso!"
puts "🌐 Teste a interface SOAP em: http://localhost:3001/patients/#{patient.id}/attendance/#{consultation.id}"
puts ""
puts "🎉 Seeds básicos executados com sucesso!"
puts ""
puts "=== DADOS DE ACESSO ==="
puts "Admin: admin@prontuario.com / password123"
puts "Médico: dr.silva@prontuario.com / password123"
puts "Usuário de teste: medico@teste.com / password123"
puts "Paciente: #{patient.name} (ID: #{patient.id})"
puts "Consulta: ID #{consultation.id}"
puts "Acesse: /patients/#{patient.id}/consultations/#{consultation.id}/attendance"

# Adicionar dados específicos para folha rosto
puts "📋 Adicionando dados para folha rosto..."

# Atualizar paciente com dados adicionais para folha rosto
patient.update!(
  weight: 75.5,
  height: 175,
  blood_pressure: "120/80",
  heart_rate: 72,
  temperature: 36.5,
  oxygen_saturation: 98,
  responsible_name: "Maria Silva Santos",
  responsible_phone: "(11) 88888-8888",
  initial_listening_notes: "Paciente relata dor de cabeça frequente e cansaço. Histórico familiar de hipertensão."
)

# Criar medicações se não existirem
unless patient.medications.any?
  patient.medications.create!([
    {
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "8/8h",
      duration: "5 dias",
      active: true
    },
    {
      name: "Enalapril", 
      dosage: "10mg",
      frequency: "12/12h",
      duration: "Uso contínuo",
      active: true
    }
  ])
end

# Criar alergias se não existirem
unless patient.allergies.any?
  patient.allergies.create!(
    allergen: "Penicilina",
    reaction: "Urticária",
    severity: "moderada",
    active: true
  )
end

# Criar sinais vitais adicionais
unless patient.vital_signs.count > 1
  patient.vital_signs.create!([
    {
      systolic_bp: 120,
      diastolic_bp: 80,
      heart_rate: 72,
      temperature: 36.5,
      respiratory_rate: 18,
      oxygen_saturation: 98,
      recorded_at: Time.current
    },
    {
      systolic_bp: 130,
      diastolic_bp: 85,
      heart_rate: 78,
      temperature: 36.8,
      respiratory_rate: 20,
      oxygen_saturation: 97,
      recorded_at: 1.week.ago
    }
  ])
end

# Criar medições se não existirem
unless patient.measurements.any?
  patient.measurements.create!([
    {
      weight: 75.5,
      height: 175,
      bmi: 24.7,
      recorded_at: Time.current
    },
    {
      weight: 76.0,
      height: 175,
      bmi: 24.8,
      recorded_at: 1.month.ago
    }
  ])
end

puts "✅ Dados da folha rosto adicionados"
puts "📋 Acesse a folha rosto em: http://localhost:3001/medical_records/#{patient.id}/folha_rosto"
