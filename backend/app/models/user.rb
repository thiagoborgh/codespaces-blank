class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :appointments, foreign_key: 'professional_id', dependent: :nullify
  has_many :consultations, foreign_key: 'professional_id', dependent: :destroy
  has_many :soap_records, foreign_key: 'professional_id', dependent: :destroy
  has_many :vital_signs, foreign_key: 'recorded_by_id', dependent: :destroy
  has_many :measurements, foreign_key: 'recorded_by_id', dependent: :destroy
  belongs_to :team, optional: true

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :role, presence: true
  validates :registration_number, uniqueness: true, allow_blank: true

  # Enums
  enum :role, {
    admin: 0,
    doctor: 1,
    nurse: 2,
    dentist: 3,
    auxiliary: 4,
    receptionist: 5
  }

  enum :status, {
    active: 0,
    inactive: 1,
    suspended: 2
  }

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :by_role, ->(role) { where(role: role) }
  scope :medical_staff, -> { where(role: [:medico, :enfermeiro, :dentista]) }

  # Instance methods
  def full_name_with_role
    "#{name} - #{role_label}"
  end

  def role_label
    I18n.t("users.roles.#{role}")
  end

  def can_prescribe_medications?
    medico? || dentista?
  end

  def can_record_vital_signs?
    !recepcionista?
  end

  def can_create_consultations?
    medical_staff?
  end

  def active_for_authentication?
    active?
  end
  
  def full_info
    "#{name} (#{registration_number}) - #{role.humanize}"
  end

  def generate_jwt
    payload = {
      user_id: id,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def self.decode_jwt(token)
    decoded = JWT.decode(token, Rails.application.secret_key_base)[0]
    User.find(decoded['user_id'])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    nil
  end

  private

  def medical_staff?
    medico? || enfermeiro? || dentista?
  end
end
