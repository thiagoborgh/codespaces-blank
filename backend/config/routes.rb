Rails.application.routes.draw do
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication
      post 'auth/login', to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      post 'auth/logout', to: 'authentication#logout'
      get 'auth/me', to: 'authentication#me'

      # Patients and related resources
      resources :patients do
        member do
          get :medical_history
          get :timeline
        end
        
        collection do
          get :search
        end

        # Nested resources for patients
        resources :appointments, except: [:update, :destroy]
        resources :consultations, except: [:update, :destroy]
        resources :medications
        resources :allergies
        resources :vital_signs
        resources :measurements
        resources :soap_records, except: [:update, :destroy]
      end

      # Appointments management (for queue)
      resources :appointments, only: [:show, :update, :destroy] do
        member do
          post :start_consultation
          patch :change_status
        end
      end

      get 'appointments_queue', to: 'appointments#queue'

      # Consultations
      resources :consultations, only: [:show, :update, :destroy] do
        resources :soap_records
        member do
          post :finalize
        end
      end

      # Teams and Users
      resources :teams, only: [:index, :show]
      resources :users, only: [:index, :show] do
        collection do
          get :professionals
        end
      end

      # Lookup/Reference data
      get 'ciap_codes', to: 'references#ciap_codes'
      get 'cid_codes', to: 'references#cid_codes'
      get 'medications_catalog', to: 'references#medications_catalog'
    end
  end

  # Root route for API
  root to: redirect('/api/v1/patients')
end
