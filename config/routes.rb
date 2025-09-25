Rails.application.routes.draw do
  resources :companies do
    resources :services do
      resources :appointments do
        collection do
          get "available-slots", action: :available_slots
          post "confirm-booking", action: :confirm_booking
        end
        member do
          post "cancel-booking", action: :cancel_booking
        end
      end
    end
  end

  get  "sign_in", to: "sessions#new"
  post "sign_in", to: "sessions#create"
  get  "sign_up", to: "registrations#new"
  post "sign_up", to: "registrations#create"
  resources :sessions, only: [ :index, :show, :destroy ]
  resource  :password, only: [ :edit, :update ]
  namespace :identity do
    resource :email,              only: [ :edit, :update ]
    resource :email_verification, only: [ :show, :create ]
    resource :password_reset,     only: [ :new, :edit, :create, :update ]
  end
  root "home#index"
  resources :statuses
  resources :projects
  get "profile", to: "profile#index"
  patch "profile", to: "profile#update_avatar"
  delete "profile/avatar", to: "profile#destroy_avatar"
  get "inertia-example", to: "inertia_example#index"

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
