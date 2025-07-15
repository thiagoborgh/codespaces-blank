class Appointment < ApplicationRecord
  # Associations
  belongs_to :patient
  belongs_to :professional, class_name: 'User', optional: true
  belongs_to :team, optional: true

  # Validations
  validates :appointment_date, presence: true
  validates :arrival_time, presence: true
  validates :status, presence: true, inclusion: { 
    in: %w[aguardando em_atendimento escuta_inicial realizado nao_aguardou] 
  }
  validates :service_type, presence: true

  # Enums
  enum :status, {
    scheduled: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3,
    no_show: 4
  }

  enum :service_type, {
    consulta: 0,
    procedimento: 1,
    exame: 2,
    vacinacao: 3,
    emergencia: 4
  }

  # Scopes
  scope :today, -> { where(appointment_date: Date.current) }
  scope :pending, -> { where(status: [:aguardando, :em_atendimento, :escuta_inicial]) }
  scope :by_professional, ->(professional_id) { where(professional_id: professional_id) }
  scope :by_status, ->(status) { where(status: status) }
  scope :ordered_by_arrival, -> { order(:arrival_time) }
  scope :ordered_by_risk, -> { order(vulnerability: :desc, arrival_time: :asc) }
  scope :recent, -> { order(created_at: :desc) }
  scope :active, -> { where(active: true) }

  # Instance methods
  def waiting_time
    return 0 unless arrival_time && status == 'aguardando'
    
    ((Time.current - arrival_time) / 1.hour).round(2)
  end

  def service_type_label
    I18n.t("appointments.service_types.#{service_type}")
  end

  def status_label
    I18n.t("appointments.statuses.#{status}")
  end

  def vulnerability_label
    I18n.t("appointments.vulnerabilities.#{vulnerability}")
  end

  def can_start_consultation?
    aguardando? || escuta_inicial?
  end

  def badge_color
    case status
    when 'aguardando'
      'success'
    when 'em_atendimento'
      'primary'
    when 'escuta_inicial'
      'info'
    when 'realizado'
      'secondary'
    when 'nao_aguardou'
      'danger'
    end
  end
end
