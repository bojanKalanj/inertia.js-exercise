class AddColorHexToServices < ActiveRecord::Migration[8.0]
  def change
    add_column :services, :color_hex, :string
  end
end
