# Seeds simples para testar o sistema
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

puts ""
puts "🎉 Seeds básicos executados com sucesso!"
puts ""
puts "=== DADOS DE ACESSO ==="
puts "Admin: admin@prontuario.com / password123"
puts "Médico: dr.silva@prontuario.com / password123"
