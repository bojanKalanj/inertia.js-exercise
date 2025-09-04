json.extract! company, :id, :name, :description, :owner_id, :created_at, :updated_at
json.url company_url(company, format: :json)
