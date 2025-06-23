class HomeController < ApplicationController
  before_action :try_authenticate

  def index
  end
end
