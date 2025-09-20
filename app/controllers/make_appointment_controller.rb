class MakeAppointmentController < AuthController
  before_action :try_authenticate

  def available_services
      set_company
      set_available_services

    render inertia: "MakeAppointment/AvailableServices", props: {
      currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
      company: @company,
      available_services: @available_services
    }
  end

  def available_slots
    set_company
    set_service
    chosen_date = params[:date].present? ? Date.parse(params[:date]) : Date.today
    set_available_slots(date: chosen_date)

    respond_to do |format|
      format.json { render json: { slots: @available_slots } }     # <– for fetch
      debugger
      format.html { render inertia: "MakeAppointment/AvailableSlots",
                     props: {
                       currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
                       company: @company,
                       service: @service,
                       available_slots: @available_slots
                     } }
    end
  end

  def confirm_booking
    set_company
    set_service
    set_available_slots(date: params[:date])
    set_booked_slot(date: params[:date], slot: params[:slot])

    render inertia: "MakeAppointment/ConfirmBooking", props: {
      currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
      company: @company,
      service: @service,
      available_slots: @available_slots
    }
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
