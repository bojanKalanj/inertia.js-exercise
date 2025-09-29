class AuthController < ApplicationController
  before_action :set_current_request_details
  before_action :authenticate

  private

    def authenticate
      session_token = cookies.signed[:session_token]
      Rails.logger.debug "Session token from cookie: #{session_token.inspect}"

      if session_record = Session.find_by_id(session_token)
        Rails.logger.debug "Found session: #{session_record.id} for user: #{session_record.user.email}"
        Current.session = session_record
      else
        Rails.logger.debug "No session found for token: #{session_token.inspect}"
        redirect_to sign_in_path
      end
    end

    def set_current_request_details
      Current.user_agent = request.user_agent
      Current.ip_address = request.ip
    end
end
