FactoryBot.define do
  factory :team do
    name { Faker::Team.name }
    description { Faker::Lorem.sentence }
    active { true }

    trait :inactive do
      active { false }
    end
  end
end
