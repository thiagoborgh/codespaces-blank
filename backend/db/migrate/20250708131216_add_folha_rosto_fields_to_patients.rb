class AddFolhaRostoFieldsToPatients < ActiveRecord::Migration[8.0]
  def change
    add_column :patients, :weight, :decimal
    add_column :patients, :height, :decimal
    add_column :patients, :blood_pressure, :string
    add_column :patients, :heart_rate, :string
    add_column :patients, :temperature, :string
    add_column :patients, :oxygen_saturation, :string
    add_column :patients, :responsible_name, :string
    add_column :patients, :responsible_phone, :string
    add_column :patients, :initial_listening_notes, :text
  end
end
