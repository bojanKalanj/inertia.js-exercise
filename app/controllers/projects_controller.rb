class ProjectsController < ApplicationController
  before_action :set_project, only: %i[ show edit update destroy ]

  inertia_share flash: -> { flash.to_hash }

  # GET /projects
  def index
    @projects = Project.all
    render inertia: "Project/Index", props: {
      projects: ProjectSerializer.render(@projects, expand: [ "status" ])
    }
  end

  # GET /projects/1
  def show
    render inertia: "Project/Show", props: {
      project: ProjectSerializer.render(@project, expand: [ "status" ])

    }
  end

  # GET /projects/new
  def new
    @project = Project.new
    render inertia: "Project/New", props: {
      project: ProjectSerializer.render(@project)
    }
  end

  # GET /projects/1/edit
  def edit
    render inertia: "Project/Edit", props: {
      project: ProjectSerializer.render(@project),
      statuses: StatusSerializer.render(Status.all)
    }
  end

  # POST /projects
  def create
    @project = Project.new(project_params)

    if @project.save
      redirect_to @project, notice: "Project was successfully created."
    else
      redirect_to new_project_url, inertia: { errors: @project.errors }
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      redirect_to @project, notice: "Project was successfully updated."
    else
      redirect_to edit_project_url(@project), inertia: { errors: @project.errors }
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy!
    redirect_to projects_url, notice: "Project was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def project_params
      params.require(:project).permit(:title)
    end
end
