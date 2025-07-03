class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :professional, null: true, foreign_key: { to_table: :users }
      t.references :team, null: true, foreign_key: true
      t.date :appointment_date, null: false
      t.datetime :arrival_time, null: false
      t.integer :status, null: false, default: 0
      t.integer :vulnerability, null: true
      t.integer :service_type, null: false
      t.text :notes

      t.timestamps
    end

    add_index :appointments, :appointment_date
    add_index :appointments, :arrival_time
    add_index :appointments, :status
    add_index :appointments, :service_type
    add_index :appointments, [:patient_id, :appointment_date]
  end
end
