import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function AvailableSlots({
  company,
  service,
}: {
  company: any;
  service: any;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (slots.length > 0) return;
    handleDateSelect(date);
  }, [date]);

  const handleDateSelect = async (d?: Date) => {
    if (!d) return;
    setDate(d);

    const formatted = d.toISOString().split("T")[0];

    const res = await fetch(
      `/companies/${company.id}/services/${service.id}/appointments/available-slots.json?date=${formatted}`
    );

    const data = await res.json();
    setSlots(data.slots);
  };

  const handleSelectSlot = (slot: any) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedSlot ||
      !clientData.name ||
      !clientData.phone ||
      !clientData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `/companies/${company.id}/services/${service.id}/appointments/confirm-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token":
              document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "",
          },
          body: JSON.stringify({
            starts_at: selectedSlot,
            ends_at: new Date(
              new Date(selectedSlot).getTime() + service.duration * 60000
            ).toISOString(),
            client_name: clientData.name,
            client_phone: clientData.phone,
            client_email: clientData.email,
          }),
        }
      );

      if (response.ok) {
        alert("Appointment booked successfully!");
        // Reset form
        setSelectedSlot(null);
        setClientData({ name: "", phone: "", email: "" });
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to book appointment"}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Layout title="Book Appointment">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
          <p className="text-gray-600">
            {service.name} - {company.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-lg border"
            />
          </div>

          {/* Available Slots Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectSlot(slot)}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className="text-sm"
                >
                  {new Date(slot).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Button>
              ))}
            </div>
            {slots.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No available slots for this date
              </p>
            )}
          </div>
        </div>

        {/* Client Information Form */}
        {showForm && selectedSlot && (
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
                  {new Date(selectedSlot).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSlot(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

