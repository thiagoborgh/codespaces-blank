class WebController < ActionController::Base
  protect_from_forgery with: :exception
  
  # Placeholder authentication method - adapt according to your authentication system
  def authenticate_user!
    # This should be replaced with your actual authentication logic
    @current_user ||= User.first # For development - replace with real auth
  end
  
  def current_user
    @current_user
  end
  
  protected
  
  def render_success(data = nil, message = nil, status = :ok)
    response = { success: true }
    response[:message] = message if message
    response[:data] = data if data
    render json: response, status: status
  end

  def render_error(message, status = :unprocessable_entity, errors = nil)
    response = { success: false, message: message }
    response[:errors] = errors if errors
    render json: response, status: status
  end

  def not_found
    render_error('Recurso não encontrado', :not_found)
  end

  def unprocessable_entity(exception)
    render_error('Dados inválidos', :unprocessable_entity, exception.record.errors)
  end

  def bad_request(exception)
    render_error(exception.message, :bad_request)
  end
end
