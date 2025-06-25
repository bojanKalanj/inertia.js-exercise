class UserSerializer < BaseSerializer
  attributes :id, :email

  attribute :avatar_url do
    next nil unless @object.avatar.attached?

    Rails.application.routes.url_helpers.rails_blob_url(@object.avatar, only_path: true)
  end

  attribute :avatar_thumbnail_url do
    next nil unless @object.avatar.attached?

    Rails.application.routes.url_helpers.rails_blob_url(@object.avatar.variant(:thumb), only_path: true)
  end

  attribute :avatar_medium_url do
    next nil unless @object.avatar.attached?

    Rails.application.routes.url_helpers.rails_blob_url(@object.avatar, only_path: true)
  end
end
