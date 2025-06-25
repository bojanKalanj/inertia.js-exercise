class ProfileController < AuthController
  def index
    render inertia: "Profile/Index", props: {
      currentUser: UserSerializer.render(Current.user)
    }
  end

  def update_avatar
    Current.user.avatar.attach(user_params[:avatar])
    redirect_to profile_path
  end

  def destroy_avatar
    Current.user.avatar.purge
    redirect_to profile_path
  end

  private

  def user_params
    params.permit(:avatar)
  end
end
