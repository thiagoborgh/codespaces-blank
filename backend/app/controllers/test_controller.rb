class TestController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :set_current_user
  
  def folha_rosto_test
    patient_id = params[:patientId] || 1
    
    # Dados simples de pacientes para teste
    patient_data = case patient_id.to_i
    when 1
      { name: "Maria Silva", cpf: "123.456.789-00", birth_date: "1990-03-15", phone: "(11) 99999-1111" }
    when 2
      { name: "João Santos", cpf: "987.654.321-00", birth_date: "1985-07-22", phone: "(11) 99999-2222" }
    when 3
      { name: "Ana Costa", cpf: "456.789.123-00", birth_date: "1992-11-08", phone: "(11) 99999-3333" }
    else
      { name: "Paciente #{patient_id}", cpf: "000.000.000-00", birth_date: "1990-01-01", phone: "(11) 99999-0000" }
    end
    
    @patient = {
      id: patient_id,
      name: patient_data[:name],
      cpf: patient_data[:cpf],
      birth_date: patient_data[:birth_date],
      phone: patient_data[:phone],
      age: Date.current.year - Date.parse(patient_data[:birth_date]).year,
      address: "Rua das Flores, 123 - Centro, São Paulo - SP"
    }
    
    # Renderizar HTML simples inline para garantir funcionamento
    html_content = <<~HTML
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Atendimento - #{@patient[:name]}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
              .card-patient { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 20px auto; max-width: 800px; }
              .patient-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
              .patient-info { padding: 20px; }
              .info-item { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 6px; }
              .label { font-weight: bold; color: #495057; }
              .value { color: #212529; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="card-patient">
                  <div class="patient-header">
                      <h2>🏥 #{@patient[:name]}</h2>
                      <p class="mb-0">Atendimento Médico - ID: #{@patient[:id]}</p>
                  </div>
                  <div class="patient-info">
                      <h4>📋 Informações do Paciente</h4>
                      <div class="info-item">
                          <span class="label">CPF:</span>
                          <span class="value">#{@patient[:cpf]}</span>
                      </div>
                      <div class="info-item">
                          <span class="label">Data de Nascimento:</span>
                          <span class="value">#{@patient[:birth_date]}</span>
                      </div>
                      <div class="info-item">
                          <span class="label">Idade:</span>
                          <span class="value">#{@patient[:age]} anos</span>
                      </div>
                      <div class="info-item">
                          <span class="label">Telefone:</span>
                          <span class="value">#{@patient[:phone]}</span>
                      </div>
                      <div class="info-item">
                          <span class="label">Endereço:</span>
                          <span class="value">#{@patient[:address]}</span>
                      </div>
                      <div class="mt-4">
                          <h5>🏥 Ações do Atendimento</h5>
                          <div class="d-flex gap-2 flex-wrap">
                              <button class="btn btn-primary">📋 Iniciar Consulta</button>
                              <button class="btn btn-success">💉 Vacinação</button>
                              <button class="btn btn-info">📊 Exames</button>
                              <button class="btn btn-warning">💊 Prescrição</button>
                              <button class="btn btn-secondary" onclick="window.history.back()">⬅️ Voltar para Fila</button>
                          </div>
                      </div>
                      <div class="mt-4">
                          <div class="alert alert-success">
                              ✅ <strong>Paciente em atendimento</strong><br>
                              Iniciado em: #{Time.current.strftime('%d/%m/%Y às %H:%M')}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    HTML
    
    render html: html_content.html_safe
  end
end
