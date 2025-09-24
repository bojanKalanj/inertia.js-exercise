import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { Calendar } from "@/components/ui/calendar";
import { UserForm, AvailableSlotsSection } from "@/components";

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

  const fetchSlots = async (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;

    const res = await fetch(
      `/companies/${company.id}/services/${service.id}/appointments/available-slots.json?date=${formatted}`
    );

    return res.json();
  };

  useEffect(() => {
    if (!date) return;

    if (slots.length > 0) return;

    const loadSlots = async () => {
      const data = await fetchSlots(date);
      setSlots(data.slots);
    };

    loadSlots();
  }, [date]);

  const handleDateSelect = async (slot?: any) => {
    if (!slot) return;
    const d = new Date(slot);
    setDate(d);

    const data = await fetchSlots(d);
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
            starts_at: selectedSlot.start,
            ends_at: selectedSlot.end,
            client_name: clientData.name,
            client_phone: clientData.phone,
            client_email: clientData.email,
          }),
        }
      );

      if (response.ok) {
        alert("Appointment booked successfully!");
        // Reset form
        const data = await fetchSlots(date || new Date());
        setSlots(data.slots);
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-lg border"
            />
          </div>

          <AvailableSlotsSection
            slots={slots}
            selectedSlot={selectedSlot}
            handleSelectSlot={handleSelectSlot}
          />
        </div>

        {showForm && selectedSlot && (
          <UserForm
            service={service}
            date={date}
            selectedSlot={selectedSlot}
            setShowForm={setShowForm}
            setSelectedSlot={setSelectedSlot}
            handleSubmitBooking={handleSubmitBooking}
            clientData={clientData}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
    </Layout>
  );
}

