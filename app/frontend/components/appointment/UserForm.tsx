import { Button } from "../ui/button";

interface UserFormProps {
  service: any;
  date: any;
  selectedSlot: any;
  handleSubmitBooking: (e: React.FormEvent) => void;
  clientData: {
    name: string;
    phone: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserForm = ({
  service,
  date,
  selectedSlot,
  handleSubmitBooking,
  clientData,
  handleInputChange,
}: UserFormProps) => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Client Information</h3>
      <form onSubmit={handleSubmitBooking} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={clientData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">
            Appointment Details
          </h4>
          <p className="text-sm text-blue-800">
            <strong>Service:</strong> {service.name}
            <br />
            <strong>Duration:</strong> {service.duration} minutes
            <br />
            <strong>Date:</strong> {date?.toLocaleDateString()}
            <br />
            <strong>Time:</strong>{" "}
            {new Date(selectedSlot.start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Confirm Booking
          </Button>
        </div>
      </form>
    </div>
  );
};

