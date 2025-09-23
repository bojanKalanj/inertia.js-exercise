class AppointmentSerializer < BaseSerializer
  attributes :id, :starts_at, :ends_at,
             :client_name, :client_phone, :client_email

  attribute :service_name do
    @object.service.name
  end
end
