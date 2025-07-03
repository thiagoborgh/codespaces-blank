class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.integer :role, null: false, default: 6
      t.integer :status, null: false, default: 0
      t.string :registration_number, null: false
      t.references :team, null: true, foreign_key: true

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :registration_number, unique: true
    add_index :users, :role
    add_index :users, :status
  end
end
