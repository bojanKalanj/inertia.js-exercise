class ProjectSerializer < BaseSerializer
  attribute :type do "Project" end

  attributes(
    "created_at",
    "updated_at",
    "title",
  )
end
