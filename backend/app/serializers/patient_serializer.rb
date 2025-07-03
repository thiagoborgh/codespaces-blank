class PatientSerializer < ActiveModel::Serializer
  attributes :id, :name, :date_of_birth, :cpf, :rg, :phone, :email,
             :gender, :address, :city, :state, :zip_code, :emergency_contact,
             :emergency_phone, :insurance_number, :insurance_provider,
             :occupation, :marital_status, :created_at, :updated_at, :age

  has_many :appointments
  has_many :consultations
  has_many :allergies
  has_many :measurements

  def date_of_birth
    object.date_of_birth&.strftime('%Y-%m-%d')
  end

  def age
    return nil unless object.date_of_birth
    ((Date.current - object.date_of_birth) / 365.25).floor
  end

  def masked_cpf
    return nil unless object.cpf
    cpf = object.cpf.gsub(/\D/, '')
    "#{cpf[0..2]}.#{cpf[3..5]}.#{cpf[6..8]}-#{cpf[9..10]}"
  end
end
