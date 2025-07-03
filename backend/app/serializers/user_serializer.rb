class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :registration_number, :role,
             :active, :created_at, :updated_at

  belongs_to :team, optional: true

  # Don't expose sensitive information
  def attributes(*args)
    hash = super
    hash.delete(:password_digest) if hash.key?(:password_digest)
    hash
  end

  def active
    object.status == 'active'
  end
end
