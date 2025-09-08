class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments do |t|
      t.references :company, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :starts_at
      t.datetime :ends_at
      t.string :client_name
      t.string :client_phone
      t.string :client_email

      t.timestamps
    end
  end
end
