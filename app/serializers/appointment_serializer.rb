class AppointmentSerializer < BaseSerializer
  attributes :id, :starts_at, :ends_at,
             :client_name, :client_phone, :client_email

  attribute :service_name do
    @object.service.name
  end

  attribute :service_color_hex do
    @object.service.color_hex
  end
end
