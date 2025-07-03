class CreateConsultationMedications < ActiveRecord::Migration[8.0]
  def change
    create_table :consultation_medications do |t|
      t.references :consultation, null: false, foreign_key: true
      t.references :medication, null: false, foreign_key: true
      t.datetime :prescribed_at, null: false
      t.string :dosage, null: false
      t.string :frequency, null: false
      t.date :start_date
      t.date :end_date
      t.text :instructions

      t.timestamps
    end

    add_index :consultation_medications, [:consultation_id, :medication_id], 
              name: 'index_consultation_medications_on_consultation_and_medication'
  end
end
