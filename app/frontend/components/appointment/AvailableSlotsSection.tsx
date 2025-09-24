import { Button } from "@/components";

export const AvailableSlotsSection = ({
  slots = [],
  selectedSlot = null,
  handleSelectSlot,
}: {
  slots: any;
  selectedSlot: any;
  handleSelectSlot: any;
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot, index) => (
          <Button
            key={index}
            onClick={() => handleSelectSlot(slot)}
            variant={selectedSlot === slot ? "default" : "outline"}
            className="text-sm"
            disabled={slot.status === "booked"}
          >
            {new Date(slot.start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

            {slot.status === "booked" && (
              <>
                <span className="text-gray-500 text-xs">
                  {slot.appointment.service_name}
                </span>
                <span className="text-gray-500 text-xs">
                  {slot.appointment.client_name}
                </span>
              </>
            )}
          </Button>
        ))}
      </div>
      {slots.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No available slots for this date
        </p>
      )}
    </div>
  );
};

