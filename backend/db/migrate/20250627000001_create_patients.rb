class CreatePatients < ActiveRecord::Migration[8.0]
  def change
    create_table :patients do |t|
      t.string :name, null: false
      t.string :cpf, null: false
      t.string :cns, null: false, limit: 15
      t.date :birth_date, null: false
      t.string :sex, null: false
      t.string :race, null: false
      t.string :mother_name
      t.string :father_name
      t.string :nationality, null: false
      t.string :birth_state, null: false
      t.string :phone, null: false
      t.string :contact_phone, null: false
      t.string :cep, null: false
      t.string :street_type, null: false
      t.string :street, null: false
      t.string :number, null: false
      t.string :neighborhood, null: false
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :patients, :cpf, unique: true
    add_index :patients, :cns, unique: true
    add_index :patients, :name
    add_index :patients, :birth_date
  end
end
