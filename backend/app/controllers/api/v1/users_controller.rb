class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update, :destroy]
  before_action :check_admin_or_self, only: [:show, :update]
  before_action :check_admin, only: [:index, :destroy, :create]

  # GET /api/v1/users
  def index
    @users = User.includes(:team)
                .page(params[:page])
                .per(params[:per_page] || 20)

    if params[:search].present?
      @users = @users.where(
        'name ILIKE ? OR email ILIKE ? OR crm ILIKE ?',
        "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%"
      )
    end

    if params[:role].present?
      @users = @users.where(role: params[:role])
    end

    if params[:team_id].present?
      @users = @users.where(team_id: params[:team_id])
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@users),
      meta: pagination_meta(@users)
    )
  end

  # GET /api/v1/users/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@user)
    )
  end

  # POST /api/v1/users
  def create
    @user = User.new(user_params)

    if @user.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@user),
        message: 'Usuário criado com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar usuário.',
        errors: @user.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/users/1
  def update
    # Remove password from params if it's blank
    if user_params[:password].blank?
      update_params = user_params.except(:password, :password_confirmation)
    else
      update_params = user_params
    end

    if @user.update(update_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@user),
        message: 'Usuário atualizado com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar usuário.',
        errors: @user.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/users/1
  def destroy
    if @user == current_user
      return render_error(message: 'Você não pode deletar sua própria conta.')
    end

    @user.destroy
    render_success(message: 'Usuário removido com sucesso.')
  end

  # GET /api/v1/users/profile
  def profile
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(current_user)
    )
  end

  # PATCH /api/v1/users/profile
  def update_profile
    # Remove admin-only fields for profile updates
    profile_params = user_params.except(:role, :team_id)

    # Remove password from params if it's blank
    if profile_params[:password].blank?
      profile_params = profile_params.except(:password, :password_confirmation)
    end

    if current_user.update(profile_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(current_user),
        message: 'Perfil atualizado com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar perfil.',
        errors: current_user.errors.full_messages
      )
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Usuário não encontrado.')
  end

  def check_admin_or_self
    unless current_user.admin? || current_user == @user
      render_unauthorized('Acesso negado.')
    end
  end

  def check_admin
    unless current_user.admin?
      render_unauthorized('Acesso negado. Apenas administradores.')
    end
  end

  def user_params
    params.require(:user).permit(
      :name, :email, :password, :password_confirmation, :crm, :specialty,
      :phone, :role, :team_id, :active
    )
  end
end
