class Api::V1::SoapRecordsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_soap_record, only: [:show, :update, :destroy]

  # GET /api/v1/soap_records
  def index
    @soap_records = SoapRecord.includes(:consultation, :patient)
                             .page(params[:page])
                             .per(params[:per_page] || 20)

    if params[:consultation_id].present?
      @soap_records = @soap_records.where(consultation_id: params[:consultation_id])
    end

    if params[:patient_id].present?
      @soap_records = @soap_records.joins(:consultation)
                                  .where(consultations: { patient_id: params[:patient_id] })
    end

    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@soap_records),
      meta: pagination_meta(@soap_records)
    )
  end

  # GET /api/v1/soap_records/1
  def show
    render_success(
      data: ActiveModelSerializers::SerializableResource.new(@soap_record, include: ['consultation'])
    )
  end

  # POST /api/v1/soap_records
  def create
    @soap_record = SoapRecord.new(soap_record_params)

    if @soap_record.save
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@soap_record),
        message: 'Registro SOAP criado com sucesso.',
        status: :created
      )
    else
      render_error(
        message: 'Erro ao criar registro SOAP.',
        errors: @soap_record.errors.full_messages
      )
    end
  end

  # PATCH/PUT /api/v1/soap_records/1
  def update
    if @soap_record.update(soap_record_params)
      render_success(
        data: ActiveModelSerializers::SerializableResource.new(@soap_record),
        message: 'Registro SOAP atualizado com sucesso.'
      )
    else
      render_error(
        message: 'Erro ao atualizar registro SOAP.',
        errors: @soap_record.errors.full_messages
      )
    end
  end

  # DELETE /api/v1/soap_records/1
  def destroy
    @soap_record.destroy
    render_success(message: 'Registro SOAP removido com sucesso.')
  end

  private

  def set_soap_record
    @soap_record = SoapRecord.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_not_found('Registro SOAP não encontrado.')
  end

  def soap_record_params
    params.require(:soap_record).permit(
      :consultation_id, :subjective, :objective, :assessment, :plan
    )
  end
end
