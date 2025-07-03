class CreateMeasurements < ActiveRecord::Migration[8.0]
  def change
    create_table :measurements do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :consultation, null: true, foreign_key: true
      t.references :recorded_by, null: false, foreign_key: { to_table: :users }
      t.datetime :measurement_date, null: false
      t.decimal :weight, precision: 5, scale: 2
      t.decimal :height, precision: 5, scale: 2
      t.decimal :head_circumference, precision: 5, scale: 2
      t.decimal :abdominal_circumference, precision: 5, scale: 2
      t.decimal :calf_circumference, precision: 5, scale: 2

      t.timestamps
    end

    add_index :measurements, :measurement_date
    add_index :measurements, [:patient_id, :measurement_date]
  end
end
