class StatusesController < ApplicationController
  before_action :set_status, only: %i[ show edit update destroy ]

  inertia_share flash: -> { flash.to_hash }

  # GET /statuses
  def index
    @statuses = Status.all
    render inertia: 'Status/Index', props: {
      statuses: @statuses.map do |status|
        serialize_status(status)
      end
    }
  end

  # GET /statuses/1
  def show
    render inertia: 'Status/Show', props: {
      status: serialize_status(@status)
    }
  end

  # GET /statuses/new
  def new
    @status = Status.new
    render inertia: 'Status/New', props: {
      status: serialize_status(@status)
    }
  end

  # GET /statuses/1/edit
  def edit
    render inertia: 'Status/Edit', props: {
      status: serialize_status(@status)
    }
  end

  # POST /statuses
  def create
    @status = Status.new(status_params)

    if @status.save
      redirect_to @status, notice: "Status was successfully created."
    else
      redirect_to new_status_url, inertia: { errors: @status.errors }
    end
  end

  # PATCH/PUT /statuses/1
  def update
    if @status.update(status_params)
      redirect_to @status, notice: "Status was successfully updated."
    else
      redirect_to edit_status_url(@status), inertia: { errors: @status.errors }
    end
  end

  # DELETE /statuses/1
  def destroy
    @status.destroy!
    redirect_to statuses_url, notice: "Status was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_status
      @status = Status.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def status_params
      params.require(:status).permit(:title, :key)
    end

    def serialize_status(status)
      status.as_json(only: [
        :id, :title, :key
      ])
    end
end
