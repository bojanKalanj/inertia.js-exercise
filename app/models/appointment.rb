class Appointment < ApplicationRecord
  belongs_to :company
  belongs_to :service
  belongs_to :provider, class_name: "User"  # required by default

  validates :starts_at, :ends_at, :client_name, presence: true

  validate :ends_after_starts
  validate :no_overlap

  scope :upcoming, -> { where("starts_at >= ?", Time.current).order(:starts_at) }
  scope :past,     -> { where("ends_at < ?", Time.current).order(starts_at: :desc) }
  scope :today,    -> { where(starts_at: Time.current.beginning_of_day..Time.current.end_of_day).order(:starts_at) }
  scope :for_company,  ->(company_id)  { where(company_id: company_id) }
  scope :for_provider, ->(provider_id) { where(provider_id: provider_id) }
  scope :on_date,  ->(date) { where(starts_at: date.beginning_of_day..date.end_of_day).order(:starts_at) }
  scope :in_week,  ->(date) { where(starts_at: date.beginning_of_week..date.end_of_week).order(:starts_at) }
  scope :in_month, ->(date) { where(starts_at: date.beginning_of_month..date.end_of_month).order(:starts_at) }

  private

  def ends_after_starts
    if starts_at && ends_at && ends_at <= starts_at
      errors.add(:ends_at, "must be after the start time")
    end
  end

  def no_overlap
    return unless starts_at && ends_at

    overlap = Appointment
      .where(company_id: company_id)
      .where(provider_id: provider_id) # add if overlaps only matter per provider
      .where.not(id: id)
      .where("(starts_at < ? AND ends_at > ?)", ends_at, starts_at)

    errors.add(:base, "This time slot overlaps with another appointment") if overlap.exists?
  end
end
