class Service < ApplicationRecord
  belongs_to :company

  validates :name, presence: true
  validates :duration, numericality: { only_integer: true, greater_than: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
end
