class AddStatusToProjects < ActiveRecord::Migration[8.0]
  def change
    add_reference :projects, :status, null: false, foreign_key: true
  end
end
