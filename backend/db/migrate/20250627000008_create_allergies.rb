class CreateAllergies < ActiveRecord::Migration[8.0]
  def change
    create_table :allergies do |t|
      t.references :patient, null: false, foreign_key: true
      t.string :allergen, null: false
      t.integer :severity, null: false
      t.integer :reaction_type, null: false
      t.text :description
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :allergies, :allergen
    add_index :allergies, :severity
    add_index :allergies, :active
    add_index :allergies, [:patient_id, :active]
  end
end
