class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern


  def try_authenticate
    session_record = Session.find_by_id(cookies.signed[:session_token])
    Current.session = session_record if session_record
  end
end
