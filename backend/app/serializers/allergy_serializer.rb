class AllergySerializer < ActiveModel::Serializer
  attributes :id, :allergen_name, :allergen_type, :severity,
             :reaction_description, :onset_date, :notes,
             :created_at, :updated_at

  belongs_to :patient

  def onset_date
    object.onset_date&.strftime('%Y-%m-%d')
  end
end
