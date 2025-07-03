class CreateConsultations < ActiveRecord::Migration[8.0]
  def change
    create_table :consultations do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :professional, null: false, foreign_key: { to_table: :users }
      t.references :appointment, null: true, foreign_key: true
      t.datetime :consultation_date, null: false
      t.integer :consultation_type, null: false
      t.integer :status, null: false, default: 0
      t.text :notes

      t.timestamps
    end

    add_index :consultations, :consultation_date
    add_index :consultations, :consultation_type
    add_index :consultations, :status
    add_index :consultations, [:patient_id, :consultation_date]
  end
end
