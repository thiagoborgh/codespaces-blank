class TeamSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :active, :created_at, :updated_at

  has_many :users

  def users_count
    object.users.count
  end
end
