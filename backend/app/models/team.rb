class Team < ApplicationRecord
  # Associations
  has_many :users, dependent: :nullify
  has_many :appointments, dependent: :nullify

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true

  # Scopes
  scope :active, -> { where(active: true) }

  # Instance methods
  def member_count
    users.count
  end

  def active_members
    users.where(status: :ativo)
  end

  def team_leader
    users.where(role: [:medico, :enfermeiro]).first
  end

  def medical_professionals
    users.where(role: [:medico, :enfermeiro, :dentista])
  end

  def can_be_deleted?
    users.empty? && appointments.empty?
  end
end
