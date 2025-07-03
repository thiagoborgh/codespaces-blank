require 'rails_helper'

RSpec.describe Api::V1::PatientsController, type: :controller do
  let(:user) { create(:user, :doctor) }
  let(:token) { JWT.encode({ user_id: user.id, exp: 1.hour.from_now.to_i }, Rails.application.secret_key_base, 'HS256') }

  before do
    request.headers['Authorization'] = "Bearer #{token}"
  end

  describe 'GET #index' do
    let!(:patients) { create_list(:patient, 3) }

    it 'returns success' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'returns list of patients' do
      get :index
      data = JSON.parse(response.body)['data']
      expect(data.length).to eq(3)
    end

    it 'supports pagination' do
      get :index, params: { page: 1, per_page: 2 }
      data = JSON.parse(response.body)['data']
      expect(data.length).to eq(2)
    end

    it 'supports search' do
      patient = create(:patient, name: 'João Silva')
      create(:patient, name: 'Maria Santos')
      
      get :index, params: { search: 'João' }
      data = JSON.parse(response.body)['data']
      expect(data.length).to eq(1)
      expect(data.first['name']).to eq('João Silva')
    end
  end

  describe 'GET #show' do
    let(:patient) { create(:patient) }

    it 'returns patient data' do
      get :show, params: { id: patient.id }
      
      expect(response).to have_http_status(:success)
      data = JSON.parse(response.body)['data']
      expect(data['id']).to eq(patient.id)
      expect(data['name']).to eq(patient.name)
    end

    it 'returns 404 for non-existent patient' do
      get :show, params: { id: 999999 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        patient: {
          name: 'João Silva',
          cpf: CPF.generate,
          cns: '123456789012345',
          birth_date: '1990-01-01',
          sex: 'masculino',
          race: 'branca',
          nationality: 'brasileira',
          birth_state: 'SP',
          phone: '11999999999',
          contact_phone: '11888888888',
          cep: '01234567',
          street_type: 'Rua',
          street: 'das Flores',
          number: '123',
          neighborhood: 'Centro'
        }
      }
    end

    it 'creates a new patient' do
      expect {
        post :create, params: valid_params
      }.to change(Patient, :count).by(1)
      
      expect(response).to have_http_status(:created)
    end

    it 'returns validation errors for invalid data' do
      post :create, params: { patient: { name: '' } }
      
      expect(response).to have_http_status(:bad_request)
      expect(JSON.parse(response.body)['errors']).to be_present
    end
  end

  describe 'PATCH #update' do
    let(:patient) { create(:patient) }

    it 'updates patient data' do
      patch :update, params: { id: patient.id, patient: { name: 'Nome Atualizado' } }
      
      expect(response).to have_http_status(:success)
      expect(patient.reload.name).to eq('Nome Atualizado')
    end

    it 'returns validation errors for invalid data' do
      patch :update, params: { id: patient.id, patient: { cpf: 'invalid' } }
      
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'DELETE #destroy' do
    let!(:patient) { create(:patient) }

    it 'deletes the patient' do
      expect {
        delete :destroy, params: { id: patient.id }
      }.to change(Patient, :count).by(-1)
      
      expect(response).to have_http_status(:success)
    end
  end

  context 'without authentication' do
    before do
      request.headers['Authorization'] = nil
    end

    it 'returns unauthorized' do
      get :index
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
