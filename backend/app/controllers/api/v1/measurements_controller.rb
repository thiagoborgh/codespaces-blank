class Api::V1::MeasurementsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_measurement, only: [:show, :update, :destroy]

  # GET /api/v1/measurements
  def index
    @measurements = Measurement.includes(:patient)
                              .page(params[:page])
                              .per(params[:per_page] || 20)

    if params[:patient_id].present?
      @measurements = @measurements.where(patient_id: params[:patient_id])
    end

    if params[:measurement_type].present?
      @measurements = @measurements.where(measurement_type: params[:measurement_type])
    end

    if params[:date_from].present?
      @measurements = @measurements.where('measured_at >= ?', params[:date_from])
    end

    if params[:date_to].present?
      @measurements = @measurements.where('measured_at <= ?', params[:date_to])
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@measurements),
      meta: pagination_meta(@measurements)
    )
  end

  # GET /api/v1/measurements/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@measurement)
    )
  end

  # POST /api/v1/measurements
  def create
    @measurement = Measurement.new(measurement_params)

    if @measurement.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@measurement),
        message: 'Medição criada com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar medição.',
        errors: @measurement.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/measurements/1
  def update
    if @measurement.update(measurement_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@measurement),
        message: 'Medição atualizada com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar medição.',
        errors: @measurement.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/measurements/1
  def destroy
    @measurement.destroy
    render_success(message: 'Medição removida com sucesso.')
  end

  private

  def set_measurement
    @measurement = Measurement.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Medição não encontrada.')
  end

  def measurement_params
    params.require(:measurement).permit(
      :patient_id, :measurement_type, :value, :unit, :measured_at,
      :reference_range, :notes
    )
  end
end
