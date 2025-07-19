class HomeController < ApplicationController
  before_action :try_authenticate

  def index
    render inertia: "Home/Index", props: {
      currentUser: Current.user ? UserSerializer.render(Current.user) : nil,
      session: Current.session ? Current.session : nil
    }
  end
end
