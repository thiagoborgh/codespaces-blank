class CreateMedications < ActiveRecord::Migration[8.0]
  def change
    create_table :medications do |t|
      t.references :patient, null: false, foreign_key: true
      t.string :name, null: false
      t.string :dosage, null: false
      t.string :frequency, null: false
      t.text :instructions
      t.date :start_date, null: false
      t.date :end_date
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :medications, :name
    add_index :medications, :active
    add_index :medications, [:patient_id, :active]
    add_index :medications, [:start_date, :end_date]
  end
end
