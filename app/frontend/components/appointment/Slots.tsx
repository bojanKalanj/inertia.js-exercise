import { Button } from "@/components";
import { BookedAppointmentPopover } from "./booked-appointment-popover";

export const Slots = ({
  slots = [],
  selectedSlot = null,
  handleSelectSlot,
  refetchSlots,
  company,
  selectedService,
}: {
  slots: any[];
  selectedSlot: any;
  handleSelectSlot: any;
  refetchSlots: () => void;
  company: any;
  selectedService: any;
}) => {
  const cancelBooking = async (appointmentId: string) => {
    const response = await fetch(
      `/companies/${company.id}/services/${selectedService.id}/appointments/${appointmentId}/cancel-booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
      }
    );

    if (response.ok) {
      console.log("Appointment canceled successfully!");
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to cancel appointment"}`);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot, index) => {
          if (slot.status === "booked") {
            return (
              <BookedAppointmentPopover
                appointment={slot.appointment}
                onCancelAppointment={async () => {
                  await cancelBooking(slot.appointment.id);
                  refetchSlots();
                }}
              />
            );
          }

          return (
            <Button
              key={index}
              onClick={() => handleSelectSlot(slot)}
              variant={selectedSlot === slot ? "default" : "outline"}
              className="text-sm"
              disabled={slot.status === "booked"}
              style={{
                borderColor: slot.appointment?.service_color_hex
                  ? slot.appointment.service_color_hex
                  : "",
              }}
            >
              {new Date(slot.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Button>
          );
        })}
      </div>
      {slots.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No available slots for this date
        </p>
      )}
    </div>
  );
};

