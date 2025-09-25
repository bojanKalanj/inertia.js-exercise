class AppointmentsController < AuthController
  before_action :try_authenticate

  def available_slots
      set_company
      set_service

      date = params[:date].present? ? Date.parse(params[:date]) : Date.today
      timeline = AvailabilityService.new(
        company: @company,
        service: @service,
        date: date
      ).timeline
      available_services = @company.services

      respond_to do |format|
        format.json { render json: { slots: timeline.map { |slot|
          {
            status: slot.status,
            start:  slot.start_time,
            end:    slot.end_time,
            appointment: slot.appointment
          }
        } } }     # <– for fetch
        format.html { render inertia: "Appointment/AvailableSlots",
                       props: {
                         currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
                         company: @company,
                         available_services: available_services
                       } }
      end
    end

  def confirm_booking
    set_company
    set_service

    begin
      # Parse the appointment times
      starts_at = DateTime.parse(params[:starts_at])
      ends_at = DateTime.parse(params[:ends_at])

      # Create the appointment
      @appointment = Appointment.create!(
        company: @company,
        service: @service,
        provider: Current.user, # Assuming the current user is the provider
        starts_at: starts_at,
        ends_at: ends_at,
        client_name: params[:client_name],
        client_phone: params[:client_phone],
        client_email: params[:client_email]
      )

      respond_to do |format|
        format.json { render json: {
          success: true,
          message: "Appointment booked successfully!",
          appointment: {
            id: @appointment.id,
            starts_at: @appointment.starts_at,
            ends_at: @appointment.ends_at,
            client_name: @appointment.client_name
          }
        } }
        format.html { redirect_to company_service_path(@company, @service),
                     notice: "Appointment booked successfully!" }
      end

    rescue ActiveRecord::RecordInvalid => e
      respond_to do |format|
        format.json { render json: {
          success: false,
          message: "Failed to book appointment",
          errors: e.record.errors.full_messages
        }, status: :unprocessable_entity }
        format.html { redirect_to available_slots_company_service_appointments_path(@company, @service),
                     alert: "Failed to book appointment: #{e.record.errors.full_messages.join(', ')}" }
      end
    rescue => e
      respond_to do |format|
        format.json { render json: {
          success: false,
          message: "An error occurred while booking the appointment"
        }, status: :internal_server_error }
        format.html { redirect_to available_slots_company_service_appointments_path(@company, @service),
                     alert: "An error occurred while booking the appointment" }
      end
    end
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def set_available_services
    @available_services = @company.services
  end

  def set_service
    @service = @company.services.find(params[:service_id])
  end

  def set_available_slots(date: Date.today)
    @available_slots = AvailabilityService.new(company: @company, service: @service, date: date).available_slots
  end
end
