class ChangeSoapTypeToStringInSoapRecords < ActiveRecord::Migration[8.0]
  def change
    # Remover índice existente
    remove_index :soap_records, :soap_type

    # Mudar tipo de coluna
    change_column :soap_records, :soap_type, :string, null: false

    # Recriar índice
    add_index :soap_records, :soap_type
  end
end
