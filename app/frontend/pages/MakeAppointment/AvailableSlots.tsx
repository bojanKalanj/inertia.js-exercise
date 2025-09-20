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

  useEffect(() => {
    if (slots.length > 0) return;
    handleDateSelect(date);
  }, [date]);

  const handleDateSelect = async (d?: Date) => {
    if (!d) return;
    setDate(d);

    const formatted = d.toISOString().split("T")[0];

    const res = await fetch(
      `/companies/${company.id}/make-appointment/${service.id}/available-slots.json?date=${formatted}`
    );

    const data = await res.json();
    setSlots(data.slots);
  };

  return (
    <Layout title="Step 1">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-lg border"
      />

      <h2>Available Slots</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            <Button>{new Date(slot).toLocaleTimeString()}</Button>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

