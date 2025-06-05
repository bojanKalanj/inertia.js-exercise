

# Clear existing data
Project.destroy_all
Status.destroy_all

# Create statuses
statuses = [
  { title: 'Not Started', key: 'not_started' },
  { title: 'In Progress', key: 'in_progress' },
  { title: 'Completed', key: 'completed' },
  { title: 'On Hold', key: 'on_hold' },
  { title: 'Cancelled', key: 'cancelled' }
]

statuses.each do |status|
  Status.create!(status)
end

# Get the default status (Not Started)
default_status = Status.find_by(key: 'not_started')

# Create projects
project_titles = [
  'Website Redesign',
  'Mobile App Development',
  'Database Migration',
  'API Integration',
  'User Authentication System',
  'Payment Gateway Implementation',
  'Content Management System',
  'Email Marketing Platform',
  'Analytics Dashboard',
  'Customer Support Portal'
]

project_titles.each do |title|
  Project.create!(title: title, status: default_status)
end

puts "Created #{Status.count} statuses and #{Project.count} projects"
