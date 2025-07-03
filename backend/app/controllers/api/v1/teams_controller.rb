class Api::V1::TeamsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_team, only: [:show, :update, :destroy]

  # GET /api/v1/teams
  def index
    @teams = Team.includes(:users)
                .page(params[:page])
                .per(params[:per_page] || 20)

    if params[:search].present?
      @teams = @teams.where(
        'name ILIKE ? OR description ILIKE ?',
        "%#{params[:search]}%", "%#{params[:search]}%"
      )
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@teams),
      meta: pagination_meta(@teams)
    )
  end

  # GET /api/v1/teams/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@team, include: ['users'])
    )
  end

  # POST /api/v1/teams
  def create
    @team = Team.new(team_params)

    if @team.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@team),
        message: 'Equipe criada com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar equipe.',
        errors: @team.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/teams/1
  def update
    if @team.update(team_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@team),
        message: 'Equipe atualizada com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar equipe.',
        errors: @team.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/teams/1
  def destroy
    if @team.users.any?
      return render_error(
        message: 'Não é possível deletar equipe com usuários associados.'
      )
    end

    @team.destroy
    render_success(message: 'Equipe removida com sucesso.')
  end

  private

  def set_team
    @team = Team.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Equipe não encontrada.')
  end

  def team_params
    params.require(:team).permit(:name, :description, :active)
  end
end
