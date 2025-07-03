FactoryBot.define do
  factory :appointment do
    association :patient
    professional { create(:user, :doctor) }
    team { create(:team) }
    appointment_date { Faker::Date.forward(days: 30) }
    arrival_time { appointment_date + rand(8..17).hours }
    status { 'agendado' }
    service_type { 'consulta' }
    notes { Faker::Lorem.sentence }

    trait :em_andamento do
      status { 'em_andamento' }
    end

    trait :concluido do
      status { 'concluido' }
    end

    trait :cancelado do
      status { 'cancelado' }
    end
  end
end
