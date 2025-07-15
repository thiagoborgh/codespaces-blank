class CreateProblems < ActiveRecord::Migration[8.0]
  def change
    create_table :problems do |t|
      t.string :name
      t.string :ciap2
      t.string :cid10
      t.boolean :active
      t.references :patient, null: false, foreign_key: true
      t.date :start_date
      t.date :end_date
      t.string :severity
      t.text :description

      t.timestamps
    end
  end
end
