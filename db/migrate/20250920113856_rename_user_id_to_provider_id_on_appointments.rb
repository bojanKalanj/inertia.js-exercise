class RenameUserIdToProviderIdOnAppointments < ActiveRecord::Migration[7.1]
  def change
    rename_column :appointments, :user_id, :provider_id
  end
end
