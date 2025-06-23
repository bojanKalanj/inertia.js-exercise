class ProfileController < AuthController
  def index
    render inertia: "Profile/Index", props: {
      currentUser: Current.user
    }
  end
end
