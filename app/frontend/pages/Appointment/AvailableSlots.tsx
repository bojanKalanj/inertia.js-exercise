import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { Calendar } from "@/components/ui/calendar";
import {
  UserForm,
  ServicesSelect,
  AccordionItem,
  Accordion,
  AccordionContent,
  AccordionTrigger,
  Slots,
} from "@/components";

export default function AvailableSlots({
  company,
  available_services,
}: {
  company: any;
  available_services: any[];
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [expanded, setExpanded] = useState<string[]>(["slots"]);
  const [selectedService, setSelectedService] = useState<any>(
    available_services[0]
  );
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const fetchSlots = async (date: Date, serviceId: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;

    const res = await fetch(
      `/companies/${company.id}/services/${serviceId}/appointments/available-slots.json?date=${formatted}`
    );

    return res.json();
  };

  useEffect(() => {
    if (!date) return;

    if (slots.length > 0) return;

    const loadSlots = async () => {
      const data = await fetchSlots(date, selectedService.id);
      setSlots(data.slots);
    };

    loadSlots();
  }, [date]);

  const handleDateSelect = async (slot?: any) => {
    if (!slot) return;
    const d = new Date(slot);
    setDate(d);

    const data = await fetchSlots(d, selectedService.id);
    setSlots(data.slots);
  };

  const handleSelectSlot = (slot: any) => {
    setSelectedSlot(slot);
    setExpanded(["form"]);
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
        `/companies/${company.id}/services/${selectedService.id}/appointments/confirm-booking`,
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
        const data = await fetchSlots(date || new Date(), selectedService.id);
        setSlots(data.slots);
        setSelectedSlot(null);
        setClientData({ name: "", phone: "", email: "" });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to book appointment"}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };
  console.log(expanded);
  return (
    <Layout title="Book Appointment">
      <div className="max-w-4xl mx-auto p-6">
        <Accordion
          type="multiple"
          className="w-full"
          value={expanded}
          onValueChange={setExpanded}
        >
          <AccordionItem value="service">
            <AccordionTrigger>{selectedService.name}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <ServicesSelect
                services={available_services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="date">
            <AccordionTrigger>
              {date
                ? `${date.toLocaleDateString()} - ${date.toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                  )}`
                : "Select Date"}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-lg border"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="slots">
            <AccordionTrigger>
              {selectedSlot
                ? new Date(selectedSlot.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Select available slot"}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Slots
                slots={slots}
                selectedSlot={selectedSlot}
                handleSelectSlot={handleSelectSlot}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="form">
            <AccordionTrigger>User data</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {selectedSlot ? (
                <UserForm
                  service={selectedService}
                  date={date}
                  selectedSlot={selectedSlot}
                  handleSubmitBooking={handleSubmitBooking}
                  clientData={clientData}
                  handleInputChange={handleInputChange}
                />
              ) : (
                "Select a slot to continue"
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
}

