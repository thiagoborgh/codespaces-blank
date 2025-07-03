class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :authenticate_user!, only: [:login, :register, :refresh]

  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      if user.active_for_authentication?
        tokens = generate_tokens(user)
        render_success(
          data: {
            user: ActiveModelSerializers::SerializableResource.new(user),
            access_token: tokens[:access_token],
            refresh_token: tokens[:refresh_token]
          },
          message: 'Login realizado com sucesso.'
        )
      else
        render_error(message: 'Conta desativada. Entre em contato com o administrador.')
      end
    else
      render_error(message: 'Email ou senha inválidos.', status: :unauthorized)
    end
  end

  # POST /api/v1/auth/logout
  def logout
    # In a production app, you might want to blacklist the token
    # For now, we'll just return success since JWT tokens are stateless
    render_success(message: 'Logout realizado com sucesso.')
  end

  # POST /api/v1/auth/refresh
  def refresh
    refresh_token = params[:refresh_token]

    if refresh_token.blank?
      return render_error(message: 'Refresh token é obrigatório.', status: :bad_request)
    end

    begin
      decoded_token = JWT.decode(
        refresh_token,
        Rails.application.secret_key_base,
        true,
        { algorithm: 'HS256' }
      ).first

      user = User.find(decoded_token['user_id'])

      if user&.active_for_authentication?
        tokens = generate_tokens(user)
        render_success(
          data: {
            access_token: tokens[:access_token],
            refresh_token: tokens[:refresh_token]
          },
          message: 'Token renovado com sucesso.'
        )
      else
        render_error(message: 'Usuário não encontrado ou inativo.', status: :unauthorized)
      end
    rescue JWT::DecodeError => e
      render_error(message: 'Refresh token inválido.', status: :unauthorized)
    rescue ActiveRecord::RecordNotFound
      render_error(message: 'Usuário não encontrado.', status: :unauthorized)
    end
  end

  # GET /api/v1/auth/me
  def me
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(current_user)
    )
  end

  # PATCH /api/v1/auth/change_password
  def change_password
    if current_user.authenticate(params[:current_password])
      if current_user.update(
        password: params[:new_password],
        password_confirmation: params[:password_confirmation]
      )
        render_success(message: 'Senha alterada com sucesso.')
      else
        render_error(
          message: 'Erro ao alterar senha.',
          errors: current_user.errors.full_messages
        )
      end
    else
      render_error(message: 'Senha atual incorreta.', status: :unauthorized)
    end
  end

  # POST /api/v1/auth/forgot_password
  def forgot_password
    user = User.find_by(email: params[:email])

    if user
      # In a real application, you would:
      # 1. Generate a secure token
      # 2. Save it to the user record with expiry
      # 3. Send password reset email
      # For now, we'll just return success
      render_success(
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
      )
    else
      # Return same message to avoid email enumeration
      render_success(
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
      )
    end
  end

  # POST /api/v1/auth/register
  def register
    user = User.new(user_params)

    if user.save
      tokens = generate_tokens(user)
      render_success(
        data: {
          user: ActiveModelSerializers::SerializableResource.new(user),
          access_token: tokens[:access_token],
          refresh_token: tokens[:refresh_token]
        },
        message: 'Usuário cadastrado com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao cadastrar usuário.',
        errors: user.errors.full_messages,
        status: :unprocessable_entity
      )
    end
  end

  private

  def generate_tokens(user)
    access_payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      exp: 1.hour.from_now.to_i
    }

    refresh_payload = {
      user_id: user.id,
      exp: 7.days.from_now.to_i
    }

    {
      access_token: JWT.encode(access_payload, Rails.application.secret_key_base, 'HS256'),
      refresh_token: JWT.encode(refresh_payload, Rails.application.secret_key_base, 'HS256')
    }
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role, :phone, :registration_number)
  end
end
