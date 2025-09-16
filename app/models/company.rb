class Company < ApplicationRecord
  belongs_to :owner, class_name: "User"
  has_many :employees, class_name: "User", foreign_key: "company_id"
  has_many :services, dependent: :destroy
  has_many :appointments, dependent: :destroy

  validates :name, presence: true
  validates :description, presence: true
end
