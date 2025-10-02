class HomeController < ApplicationController
  before_action :try_authenticate

  def index
    current_user = Current.user
    @companies = Company.where(owner: current_user)
    @services = Service.where(company: @companies)


    render inertia: "Home/Index", props: {
      currentUser: current_user ? UserSerializer.render(current_user) : nil,
      session: Current.session ? Current.session : nil,
      companies: @companies ? @companies : nil,
      services: @services ? @services : nil
    }
  end
end
