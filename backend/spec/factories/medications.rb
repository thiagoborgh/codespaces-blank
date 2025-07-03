FactoryBot.define do
  factory :medication do
    name { "#{Faker::Commerce.product_name} #{rand(5..1000)}mg" }
    generic_name { Faker::Commerce.product_name }
    description { Faker::Lorem.sentence }
    dosage_form { ['Comprimido', 'Cápsula', 'Xarope', 'Injeção'].sample }
    strength { "#{rand(5..1000)}mg" }
    route_administration { ['Oral', 'Intravenoso', 'Intramuscular', 'Tópico'].sample }
    category { ['Analgésico', 'Antibiótico', 'Anti-inflamatório', 'Vitamina'].sample }
    manufacturer { Faker::Company.name }
    active { true }

    trait :inactive do
      active { false }
    end
  end
end
