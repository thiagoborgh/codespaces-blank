class MedicationSerializer < ActiveModel::Serializer
  attributes :id, :name, :generic_name, :description, :dosage_form,
             :strength, :route_administration, :category, :manufacturer,
             :active, :created_at, :updated_at
end
