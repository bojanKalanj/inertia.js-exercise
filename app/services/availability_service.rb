class AvailabilityService
  def initialize(company:, service:, date:, work_start: 9, work_end: 17)
    @company = company
    @service = service
    @date = date
    @work_start = work_start
    @work_end = work_end
  end

  def available_slots
    # All appointments for this company on the given date
    booked = @company.appointments.on_date(@date).order(:starts_at)

    # Define working window
    day_start = @date.to_time.change(hour: @work_start, min: 0)
    day_end   = @date.to_time.change(hour: @work_end, min: 0)

    # Build slots
    slots = []
    cursor = day_start

    while (cursor + @service.duration.minutes) <= day_end
      slot_end = cursor + @service.duration.minutes

      # Check overlap
      overlaps = booked.any? do |appt|
        (cursor < appt.ends_at) && (slot_end > appt.starts_at)
      end

      slots << cursor unless overlaps
      cursor += 15.minutes # step between slots (configurable)
    end

    slots
  end
end
