import { Button } from "@/components";

export const Slots = ({
  slots = [],
  selectedSlot = null,
  handleSelectSlot,
}: {
  slots: any[];
  selectedSlot: any;
  handleSelectSlot: any;
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot, index) => (
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

            {slot.status === "booked" && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className=" text-xs">
                    {slot.appointment.service_name}
                  </span>
                </div>
                <span className=" text-xs">{slot.appointment.client_name}</span>
              </div>
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

