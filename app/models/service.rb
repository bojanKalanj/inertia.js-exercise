class Service < ApplicationRecord
  belongs_to :company

  validates :name, presence: true
  validates :duration, numericality: { only_integer: true, greater_than: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :color_hex, format: { with: /\A#[0-9A-Fa-f]{6}\z/, message: "must be a valid hex color (e.g., #FF5733)" }, allow_blank: true

  # Default color if none is set
  def color_hex
    super || "#3B82F6" # Default blue color
  end
end
