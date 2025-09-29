class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern


  def try_authenticate
    session_token = cookies.signed[:session_token]
    Rails.logger.debug "Try authenticate - Session token: #{session_token.inspect}"

    session_record = Session.find_by_id(session_token)
    if session_record
      Rails.logger.debug "Try authenticate - Found session: #{session_record.id} for user: #{session_record.user.email}"
      Current.session = session_record
    else
      Rails.logger.debug "Try authenticate - No session found for token: #{session_token.inspect}"
    end
  end
end
