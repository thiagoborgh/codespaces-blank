require 'rails_helper'

RSpec.describe Api::V1::AuthenticationController, type: :controller do
  describe 'POST #login' do
    let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context 'with valid credentials' do
      it 'returns success with tokens' do
        post :login, params: { email: user.email, password: 'password123' }
        
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['success']).to be true
        expect(JSON.parse(response.body)['data']).to have_key('access_token')
        expect(JSON.parse(response.body)['data']).to have_key('refresh_token')
      end

      it 'includes user data in response' do
        post :login, params: { email: user.email, password: 'password123' }
        
        user_data = JSON.parse(response.body)['data']['user']
        expect(user_data['email']).to eq(user.email)
        expect(user_data['name']).to eq(user.name)
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized for wrong password' do
        post :login, params: { email: user.email, password: 'wrongpassword' }
        
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['success']).to be false
      end

      it 'returns unauthorized for non-existent user' do
        post :login, params: { email: 'nonexistent@example.com', password: 'password123' }
        
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['success']).to be false
      end
    end

    context 'with inactive user' do
      let(:inactive_user) { create(:user, :inactive, email: 'inactive@example.com', password: 'password123') }

      it 'returns error for inactive user' do
        post :login, params: { email: inactive_user.email, password: 'password123' }
        
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['message']).to include('desativada')
      end
    end
  end

  describe 'GET #me' do
    let(:user) { create(:user) }
    let(:token) { JWT.encode({ user_id: user.id, exp: 1.hour.from_now.to_i }, Rails.application.secret_key_base, 'HS256') }

    context 'with valid token' do
      it 'returns current user data' do
        request.headers['Authorization'] = "Bearer #{token}"
        get :me
        
        expect(response).to have_http_status(:success)
        user_data = JSON.parse(response.body)['data']
        expect(user_data['id']).to eq(user.id)
      end
    end

    context 'without token' do
      it 'returns unauthorized' do
        get :me
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #logout' do
    let(:user) { create(:user) }
    let(:token) { JWT.encode({ user_id: user.id, exp: 1.hour.from_now.to_i }, Rails.application.secret_key_base, 'HS256') }

    it 'returns success' do
      request.headers['Authorization'] = "Bearer #{token}"
      post :logout
      
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['message']).to include('Logout')
    end
  end
end
