class ServicesController < ApplicationController
  before_action :try_authenticate
  before_action :set_company
  before_action :authorize_manage_company!, except: %i[index show]
  before_action :set_service, only: %i[show edit update destroy]

  def index
    @services = @company.services.order(:name)
  end

  def show; end

  def new
    @service = @company.services.build
  end

  def create
    @service = @company.services.build(service_params)

    if @service.save
      redirect_to company_service_path(@company, @service), notice: "Service created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @service.update(service_params)
      redirect_to company_service_path(@company, @service), notice: "Service updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @service.destroy
    redirect_to company_services_path(@company), notice: "Service removed."
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def set_service
    @service = @company.services.find(params[:id])
  end

  # Simple authorization:
  # owners of the company or employees assigned to the company can manage services.
  def authorize_manage_company!
    return if can_manage_company?(@company)

    redirect_to company_services_path(@company), alert: "Not authorized."
  end

  def can_manage_company?(company)
    return false unless Current.user

    # owner (user who created the company)
    return true if Current.user.owned_companies.exists?(id: company.id)

    # employee (if you later add company_id to users)
    return true if Current.user.respond_to?(:company_id) && Current.user.company_id.present? && Current.user.company_id == company.id

    false
  end

  def service_params
    params.require(:service).permit(:name, :description, :duration, :price, :color_hex)
  end
end
