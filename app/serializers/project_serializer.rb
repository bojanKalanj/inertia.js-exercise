class ProjectSerializer < BaseSerializer
  attribute :type do "Project" end

  attributes(
    "created_at",
    "updated_at",
    "title",
    "id",
    "status_id",
  )

  attribute :status, if: -> { expand.include?("status") && project.status } do
    StatusSerializer.render(project.status)
  end
end
