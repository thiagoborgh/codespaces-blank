class MedicalRecordsController < ApplicationController
  before_action :set_patient, only: [:show, :folha_rosto, :update_card, :update_measurement]
  
  def index
    @patients = Patient.all
  end

  def show
    redirect_to folha_rosto_medical_record_path(@patient)
  end

  def folha_rosto
    # Carrega os dados necessários para a folha rosto
    @timeline_events = build_timeline_events
    @recent_exams = @patient.exam_results.recent.limit(3).map do |exam|
      {
        name: exam.name,
        date: exam.date.strftime('%d/%m/%Y'),
        result: exam.result
      }
    end
    @initial_listening = @patient.initial_listening_notes
    @prenatal_info = build_prenatal_info
    
    # Dados para tabelas de informações de atendimento
    @consultations = @patient.consultations.includes(:user).order(created_at: :desc)
    @referrals = @patient.referrals.includes(:user).order(created_at: :desc)
    
    # Dados para medições e gráficos
    @measurements = @patient.measurements.includes(:consultation).order(created_at: :desc)
    @vital_signs = @patient.vital_signs.includes(:consultation).order(created_at: :desc)
    @glycemia_measurements = @patient.glycemia_measurements.includes(:consultation).order(created_at: :desc)
    
    # Dados para overview
    @problems = @patient.problems.active
    @allergies = @patient.allergies.active
    @medications = @patient.medications.active
    @active_consultation = @patient.consultations.in_progress.last
  end

  def update_card
    card_type = params[:card_type]
    content = params[:content]
    
    begin
      case card_type
      when 'vaccination'
        update_vaccination_card(content)
      when 'problems'
        update_problems_card(content)
      when 'exams'
        update_exams_card(content)
      when 'allergies'
        update_allergies_card(content)
      when 'reminders'
        update_reminders_card(content)
      when 'medications'
        update_medications_card(content)
      when 'medical_history'
        update_medical_history_card(content)
      when 'initial_listening'
        update_initial_listening_card(content)
      when 'prenatal'
        update_prenatal_card(content)
      end
      
      render json: { status: 'success', message: 'Card atualizado com sucesso' }
    rescue => e
      Rails.logger.error "Erro ao atualizar card: #{e.message}"
      render json: { status: 'error', message: 'Erro ao atualizar card' }
    end
  end

  def update_measurement
    measurement = @patient.measurements.find(params[:id])
    field = params[:field]
    value = params[:value]
    
    begin
      measurement.update!(field => value)
      render json: { success: true, message: 'Medição atualizada com sucesso' }
    rescue => e
      Rails.logger.error "Erro ao atualizar medição: #{e.message}"
      render json: { success: false, message: 'Erro ao atualizar medição' }
    end
  end

  private

  def set_patient
    @patient = Patient.find(params[:id])
  end

  def build_timeline_events
    events = []
    
    # Adiciona consultas
    @patient.consultations.recent.limit(5).each do |consultation|
      events << {
        date: time_ago_in_words(consultation.date),
        title: "Consulta #{consultation.specialty}",
        badges: [
          { class: 'bg-primary', text: 'Consulta' }
        ]
      }
    end
    
    # Adiciona vacinações
    @patient.vaccinations.recent.limit(3).each do |vaccination|
      events << {
        date: time_ago_in_words(vaccination.date),
        title: "Vacina #{vaccination.vaccine_name}",
        badges: [
          { class: 'bg-success', text: 'Vacinação' }
        ]
      }
    end
    
    # Adiciona procedimentos
    @patient.procedures.recent.limit(3).each do |procedure|
      events << {
        date: time_ago_in_words(procedure.date),
        title: "Procedimento",
        badges: [
          { class: 'bg-warning text-dark', text: 'Procedimento' }
        ]
      }
    end
    
    # Adiciona escuta inicial se existir
    if @patient.initial_listening.present?
      events << {
        date: time_ago_in_words(@patient.initial_listening.created_at),
        title: "Escuta inicial",
        badges: [
          { class: 'bg-info text-white', text: 'Escuta' }
        ]
      }
    end
    
    # Ordena eventos por data (mais recente primeiro)
    events.sort_by { |e| e[:date] }
  end

  def build_prenatal_info
    return nil unless @patient.gender == 'female' && @patient.prenatal_records.exists?
    
    latest_prenatal = @patient.prenatal_records.latest
    if latest_prenatal
      "IG Cronológica: #{latest_prenatal.gestational_weeks} semanas e #{latest_prenatal.gestational_days} dias"
    end
  end

  def update_vaccination_card(content)
    # Processa o conteúdo da vacina e salva
    # Exemplo: parse do texto e criação de registros de vacinação
    @patient.vaccination_notes = content
    @patient.save!
  end

  def update_problems_card(content)
    # Processa problemas/condições
    @patient.problems_notes = content
    @patient.save!
  end

  def update_exams_card(content)
    # Processa resultados de exames
    @patient.exam_notes = content
    @patient.save!
  end

  def update_allergies_card(content)
    # Processa alergias
    @patient.allergy_notes = content
    @patient.save!
  end

  def update_reminders_card(content)
    # Processa lembretes
    @patient.reminder_notes = content
    @patient.save!
  end

  def update_medications_card(content)
    # Processa medicamentos
    @patient.medication_notes = content
    @patient.save!
  end

  def update_medical_history_card(content)
    # Processa antecedentes
    @patient.medical_history_notes = content
    @patient.save!
  end

  def update_initial_listening_card(content)
    # Processa escuta inicial
    @patient.initial_listening_notes = content
    @patient.save!
  end

  def update_prenatal_card(content)
    # Processa informações pré-natais
    @patient.prenatal_notes = content
    @patient.save!
  end
end
