class AddFinalizationFieldsToConsultations < ActiveRecord::Migration[8.0]
  def change
    add_column :consultations, :attendance_type, :string
    add_column :consultations, :conduct, :string
    add_column :consultations, :shared_care, :json
    add_column :consultations, :municipality_participation, :boolean, default: false
    add_column :consultations, :participation_form, :string
    add_column :consultations, :health_rationality, :string
    add_column :consultations, :outcome, :string
    add_column :consultations, :print_on_finish, :boolean, default: false
    add_column :consultations, :observations, :text
    add_column :consultations, :notification_forms, :json
    add_column :consultations, :scheduled_appointment, :json
  end
end
