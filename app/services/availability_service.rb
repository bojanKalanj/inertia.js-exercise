class AvailabilityService
  Slot = Struct.new(:status, :start_time, :end_time, :appointment, keyword_init: true)

  def initialize(company:, service:, date:, work_start: 9, work_end: 17, step: 5)
    @company    = company
    @service    = service
    @date       = date
    @work_start = work_start
    @work_end   = work_end
    @step       = step.minutes
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
      cursor += @step
    end

    slots
  end

  def timeline
    booked = @company.appointments
                     .on_date(@date)
                     .order(:starts_at)

    day_start = @date.to_time.change(hour: @work_start, min: 0)
    day_end   = @date.to_time.change(hour: @work_end,   min: 0)

    slots = []
    cursor = day_start

    while (cursor + @service.duration.minutes) <= day_end
      slot_end = cursor + @service.duration.minutes

      # Find any booked appointment overlapping this potential slot
      overlapping_appt = booked.find do |appt|
        cursor < appt.ends_at && slot_end > appt.starts_at
      end

      if overlapping_appt
        # Add the booked appointment as a booked slot (once)
        unless slots.any? { |s| s.appointment == overlapping_appt }
          slots << Slot.new(
            status: :booked,
            start_time: overlapping_appt.starts_at,
            end_time:   overlapping_appt.ends_at,
            appointment: AppointmentSerializer.render(overlapping_appt)
          )
        end
        # Jump cursor to the end of that booked appointment
        cursor = overlapping_appt.ends_at
      else
        slots << Slot.new(
          status: :available,
          start_time: cursor,
          end_time: slot_end,
          appointment: nil
        )
        cursor += @step
      end
    end

    slots
  end
end
