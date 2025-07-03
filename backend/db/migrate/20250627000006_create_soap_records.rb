class CreateSoapRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :soap_records do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :consultation, null: false, foreign_key: true
      t.references :professional, null: false, foreign_key: { to_table: :users }
      t.integer :soap_type, null: false
      t.text :content, null: false
      t.json :vital_signs_data
      t.json :measurements_data
      t.json :medications_data
      t.json :exams_data
      t.json :procedures_data

      t.timestamps
    end

    add_index :soap_records, :soap_type
    add_index :soap_records, [:patient_id, :created_at]
    add_index :soap_records, [:consultation_id, :soap_type]
  end
end
