class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  
  before_action :authenticate_user!
  before_action :set_current_user

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request

  protected

  def authenticate_user!
    authenticate_or_request_with_http_token do |token, options|
      @current_user = User.decode_jwt(token)
    end
  end

  def current_user
    @current_user
  end

  def set_current_user
    Current.user = current_user if current_user
  end

  def render_success(data = nil, message = nil, status = :ok)
    response = { success: true }
    response[:message] = message if message
    response[:data] = data if data
    
    render json: response, status: status
  end

  def render_error(message, status = :bad_request, errors = nil)
    response = { 
      success: false, 
      message: message 
    }
    response[:errors] = errors if errors
    
    render json: response, status: status
  end

  private

  def not_found(exception)
    render_error("Registro não encontrado", :not_found)
  end

  def unprocessable_entity(exception)
    render_error(
      "Dados inválidos", 
      :unprocessable_entity, 
      exception.record.errors.full_messages
    )
  end

  def bad_request(exception)
    render_error("Parâmetros inválidos", :bad_request)
  end
end
