class CreateVitalSigns < ActiveRecord::Migration[8.0]
  def change
    create_table :vital_signs do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :consultation, null: true, foreign_key: true
      t.references :recorded_by, null: false, foreign_key: { to_table: :users }
      t.datetime :measurement_date, null: false
      t.integer :systolic_pressure, null: false
      t.integer :diastolic_pressure, null: false
      t.integer :heart_rate, null: false
      t.integer :respiratory_rate
      t.decimal :temperature, precision: 4, scale: 2
      t.integer :oxygen_saturation

      t.timestamps
    end

    add_index :vital_signs, :measurement_date
    add_index :vital_signs, [:patient_id, :measurement_date]
  end
end
