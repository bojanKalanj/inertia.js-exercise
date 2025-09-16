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

  def available_slots (date: Date.today)
    set_company
    set_service
    set_available_slots(date: date)

    render inertia: "MakeAppointment/AvailableSlots", props: {
      currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
      company: @company,
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
