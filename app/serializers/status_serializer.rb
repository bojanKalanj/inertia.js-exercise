class StatusSerializer < BaseSerializer
  attribute :type do "Project" end

  attributes(
    "created_at",
    "updated_at",
    "id",
    "title",
    "key",
  )
end
