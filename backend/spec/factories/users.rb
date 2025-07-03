FactoryBot.define do
  factory :user do
    name { "#{Faker::Name.first_name} #{Faker::Name.last_name}" }
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    registration_number { Faker::Alphanumeric.alpha(number: 8).upcase }
    role { 'doctor' }
    status { 'active' }

    trait :admin do
      role { 'admin' }
      registration_number { 'ADMIN001' }
    end

    trait :doctor do
      role { 'doctor' }
      registration_number { "CRM#{Faker::Number.number(digits: 6)}" }
    end

    trait :nurse do
      role { 'nurse' }
      registration_number { "COREN#{Faker::Number.number(digits: 5)}" }
    end

    trait :inactive do
      status { 'inactive' }
    end
  end
end
