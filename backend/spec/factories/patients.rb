FactoryBot.define do
  factory :patient do
    name { "#{Faker::Name.first_name} #{Faker::Name.last_name}" }
    cpf { CPF.generate }
    cns { Faker::Number.number(digits: 15).to_s }
    birth_date { Faker::Date.birthday(min_age: 18, max_age: 80) }
    sex { ['masculino', 'feminino'].sample }
    race { ['branca', 'preta', 'parda', 'amarela', 'indigena'].sample }
    mother_name { "#{Faker::Name.first_name} #{Faker::Name.last_name}" }
    father_name { "#{Faker::Name.first_name} #{Faker::Name.last_name}" }
    nationality { 'brasileira' }
    birth_state { Faker::Address.state_abbr }
    phone { Faker::PhoneNumber.cell_phone.gsub(/\D/, '')[0..10] }
    contact_phone { Faker::PhoneNumber.cell_phone.gsub(/\D/, '')[0..10] }
    cep { '01234567' }
    street_type { 'Rua' }
    street { Faker::Address.street_name }
    number { Faker::Address.building_number }
    neighborhood { Faker::Address.community }
    active { true }

    trait :inactive do
      active { false }
    end
  end
end
