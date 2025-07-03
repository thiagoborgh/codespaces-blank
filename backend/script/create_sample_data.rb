#!/usr/bin/env ruby

# Script para criar dados de teste no sistema
puts "🌱 Criando dados de exemplo..."

# Criar usuário admin
admin = User.create!(
  name: 'Administrador do Sistema',
  email: 'admin@prontuario.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'admin',
  registration_number: 'ADMIN001'
)

puts "✅ Admin criado: #{admin.email}"

# Criar equipe
team = Team.create!(
  name: 'Equipe Principal',
  description: 'Equipe médica principal do sistema'
)

puts "✅ Equipe criada: #{team.name}"

# Criar médico
doctor = User.create!(
  name: 'Dr. João Silva',
  email: 'dr.silva@prontuario.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'doctor',
  registration_number: 'CRM12345',
  team: team
)

puts "✅ Médico criado: #{doctor.name}"

# Criar paciente
patient = Patient.create!(
  name: 'Carlos Oliveira',
  birth_date: Date.new(1985, 5, 15),
  cpf: '12345678901',
  cns: '123456789012345',
  sex: 'masculino',
  race: 'branca',
  mother_name: 'Maria Oliveira',
  father_name: 'José Oliveira',
  nationality: 'brasileira',
  birth_state: 'SP',
  phone: '11955555555',
  contact_phone: '11944444444',
  cep: '01234567',
  street_type: 'Rua',
  street: 'das Flores',
  number: '123',
  neighborhood: 'Centro'
)

puts "✅ Paciente criado: #{patient.name}"

# Criar medicamento
medication = Medication.create!(
  name: 'Paracetamol 500mg',
  generic_name: 'Paracetamol',
  description: 'Analgésico e antitérmico',
  dosage_form: 'Comprimido',
  strength: '500mg',
  route_administration: 'Oral',
  category: 'Analgésico',
  manufacturer: 'Laboratório ABC',
  active: true
)

puts "✅ Medicamento criado: #{medication.name}"

# Criar agendamento
appointment = Appointment.create!(
  patient: patient,
  professional_id: doctor.id,
  team_id: team.id,
  appointment_date: Date.current + 1.day,
  arrival_time: Date.current + 1.day + 9.hours,
  status: 'agendado',
  service_type: 'consulta',
  notes: 'Consulta de rotina'
)

puts "✅ Agendamento criado para: #{appointment.appointment_date}"

puts ""
puts "🎉 Dados de exemplo criados com sucesso!"
puts ""
puts "📊 Resumo:"
puts "  - Usuários: #{User.count}"
puts "  - Equipes: #{Team.count}"
puts "  - Pacientes: #{Patient.count}"
puts "  - Medicamentos: #{Medication.count}"
puts "  - Agendamentos: #{Appointment.count}"
puts ""
puts "🔑 Credenciais para teste:"
puts "  Admin: admin@prontuario.com / password123"
puts "  Médico: dr.silva@prontuario.com / password123"
