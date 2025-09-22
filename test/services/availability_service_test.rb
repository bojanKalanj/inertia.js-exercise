require "test_helper"

class AvailabilityServiceTest < ActiveSupport::TestCase
  def setup
    @company = companies(:one)
    @service = services(:one)
    @service.update!(duration: 30) # 30-minute service
    @date = Date.current
    @user = users(:lazaro_nixon)
  end

  test "should initialize with correct parameters" do
    service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date,
      work_start: 9,
      work_end: 17
    )

    assert_not_nil service
  end

  test "should generate available slots for a day with no appointments" do
    # Clear any existing appointments for the test date
    @company.appointments.on_date(@date).destroy_all

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should have slots from 9:00 AM to 5:00 PM (17:00) with 5-minute intervals
    # Each slot is 30 minutes, so we can fit slots every 5 minutes
    # From 9:00 to 17:00 is 8 hours = 480 minutes
    # With 5-minute intervals, we should have 96 possible start times
    # But only those that fit a 30-minute service (ending before 17:00)
    # So slots from 9:00 to 16:30 (last slot that fits)
    # Actually: 9:00, 9:05, 9:10, ..., 16:30 = 91 slots
    expected_slots = 91 # 8 hours * 12 slots per hour (every 5 minutes) - 5 slots that don't fit

    assert_equal expected_slots, slots.length
    assert_equal @date.to_time.change(hour: 9, min: 0), slots.first
    assert_equal @date.to_time.change(hour: 16, min: 30), slots.last
  end

  test "should exclude slots that overlap with existing appointments" do
    # Create an appointment from 10:00 to 10:30
    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 10, min: 0),
      ends_at: @date.to_time.change(hour: 10, min: 30),
      client_name: "Test Client",
      client_phone: "123-456-7890",
      client_email: "test@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should not include any slots that overlap with 10:00-10:30
    # This means no slots starting from 9:35 to 10:25 (10:30 is allowed since appointment ends exactly when slot starts)
    overlapping_slots = slots.select do |slot|
      slot >= @date.to_time.change(hour: 9, min: 35) &&
      slot <= @date.to_time.change(hour: 10, min: 25)
    end

    assert_empty overlapping_slots, "Should not include overlapping slots"
  end

  test "should handle multiple overlapping appointments" do
    # Create two appointments: 10:00-10:30 and 11:00-11:30
    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 10, min: 0),
      ends_at: @date.to_time.change(hour: 10, min: 30),
      client_name: "Client 1",
      client_phone: "123-456-7890",
      client_email: "client1@example.com"
    )

    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 11, min: 0),
      ends_at: @date.to_time.change(hour: 11, min: 30),
      client_name: "Client 2",
      client_phone: "123-456-7891",
      client_email: "client2@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should not include slots overlapping with either appointment
    overlapping_slots = slots.select do |slot|
      (slot >= @date.to_time.change(hour: 9, min: 35) && slot <= @date.to_time.change(hour: 10, min: 25)) ||
      (slot >= @date.to_time.change(hour: 10, min: 35) && slot <= @date.to_time.change(hour: 11, min: 25))
    end

    assert_empty overlapping_slots, "Should not include slots overlapping with any appointment"
  end

  test "should respect custom work hours" do
    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date,
      work_start: 8,
      work_end: 12
    )

    slots = availability_service.available_slots

    # Should only have slots from 8:00 AM to 12:00 PM
    assert_equal @date.to_time.change(hour: 8, min: 0), slots.first
    assert_equal @date.to_time.change(hour: 11, min: 30), slots.last

    # Should not have any slots outside work hours
    outside_hours = slots.select do |slot|
      slot.hour < 8 || slot.hour >= 12
    end

    assert_empty outside_hours, "Should not include slots outside work hours"
  end

  test "should handle different service durations" do
    # Test with a 60-minute service
    long_service = @company.services.create!(
      name: "Long Service",
      description: "A long service",
      duration: 60,
      price: 100.0
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: long_service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should have fewer slots since each slot is 60 minutes
    # From 9:00 to 17:00, we can fit slots every 5 minutes that end before 17:00
    # So: 9:00, 9:05, 9:10, ..., 16:00 = 85 slots (16:05, 16:10, 16:15, 16:20, 16:25, 16:30, 16:35, 16:40, 16:45, 16:50, 16:55 don't fit)
    expected_slots = 85

    assert_equal expected_slots, slots.length
    assert_equal @date.to_time.change(hour: 9, min: 0), slots.first
    assert_equal @date.to_time.change(hour: 16, min: 0), slots.last
  end

  test "should handle appointments from different companies" do
    # Create another company and appointment
    other_company = companies(:two)
    other_company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 10, min: 0),
      ends_at: @date.to_time.change(hour: 10, min: 30),
      client_name: "Other Company Client",
      client_phone: "123-456-7890",
      client_email: "other@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should include slots at 10:00 since the appointment is for a different company
    ten_oclock_slots = slots.select { |slot| slot.hour == 10 && slot.min == 0 }
    assert_not_empty ten_oclock_slots, "Should include slots for different company's appointments"
  end

  test "should handle edge case where appointment ends exactly when slot starts" do
    # Create an appointment from 10:00 to 10:30
    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 10, min: 0),
      ends_at: @date.to_time.change(hour: 10, min: 30),
      client_name: "Edge Case Client",
      client_phone: "123-456-7890",
      client_email: "edge@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should include 10:30 slot (appointment ends exactly when slot starts)
    ten_thirty_slot = slots.find { |slot| slot.hour == 10 && slot.min == 30 }
    assert_not_nil ten_thirty_slot, "Should include slot that starts when appointment ends"

    # Should not include 10:25 slot (would overlap)
    ten_twenty_five_slot = slots.find { |slot| slot.hour == 10 && slot.min == 25 }
    assert_nil ten_twenty_five_slot, "Should not include slot that would overlap"
  end

  test "should handle edge case where appointment starts exactly when slot ends" do
    # Create an appointment from 10:30 to 11:00
    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: @date.to_time.change(hour: 10, min: 30),
      ends_at: @date.to_time.change(hour: 11, min: 0),
      client_name: "Edge Case Client 2",
      client_phone: "123-456-7890",
      client_email: "edge2@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should include 10:00 slot (appointment starts exactly when slot ends)
    ten_oclock_slot = slots.find { |slot| slot.hour == 10 && slot.min == 0 }
    assert_not_nil ten_oclock_slot, "Should include slot that ends when appointment starts"

    # Should not include 10:25 slot (would overlap)
    ten_twenty_five_slot = slots.find { |slot| slot.hour == 10 && slot.min == 25 }
    assert_nil ten_twenty_five_slot, "Should not include slot that would overlap"
  end

  test "should return empty array when no slots fit in work hours" do
    # Create a service that's longer than work hours
    long_service = @company.services.create!(
      name: "Very Long Service",
      description: "A very long service",
      duration: 600, # 10 hours
      price: 100.0
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: long_service,
      date: @date,
      work_start: 9,
      work_end: 17
    )

    slots = availability_service.available_slots

    assert_empty slots, "Should return empty array when service duration exceeds work hours"
  end

  test "should handle appointments on different dates" do
    # Create an appointment for tomorrow
    tomorrow = @date + 1.day
    @company.appointments.create!(
      service: @service,
      provider: @user,
      starts_at: tomorrow.to_time.change(hour: 10, min: 0),
      ends_at: tomorrow.to_time.change(hour: 10, min: 30),
      client_name: "Tomorrow Client",
      client_phone: "123-456-7890",
      client_email: "tomorrow@example.com"
    )

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should include 10:00 slot since appointment is on a different date
    ten_oclock_slot = slots.find { |slot| slot.hour == 10 && slot.min == 0 }
    assert_not_nil ten_oclock_slot, "Should include slots when appointment is on different date"
  end

  test "should handle 5-minute slot intervals correctly" do
    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Check that slots are 5 minutes apart
    (0...slots.length - 1).each do |i|
      time_diff = slots[i + 1] - slots[i]
      assert_equal 5.minutes, time_diff, "Slots should be 5 minutes apart"
    end
  end

  test "should handle service duration of 1 minute" do
    # Update service to 1 minute duration
    @service.update!(duration: 1)

    availability_service = AvailabilityService.new(
      company: @company,
      service: @service,
      date: @date
    )

    slots = availability_service.available_slots

    # Should have many more slots since each slot is only 1 minute
    # From 9:00 to 17:00 is 8 hours = 480 minutes
    # With 5-minute intervals, we should have 96 possible start times
    expected_slots = 96

    assert_equal expected_slots, slots.length
    assert_equal @date.to_time.change(hour: 9, min: 0), slots.first
    assert_equal @date.to_time.change(hour: 16, min: 55), slots.last
  end
end
