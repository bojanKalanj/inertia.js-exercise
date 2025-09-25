import { RadioGroup, RadioGroupItem, Label } from "@/components";

export const ServicesSelect = ({
  services,
  selectedService,
  setSelectedService,
}: {
  services: any[];
  selectedService: any;
  setSelectedService: any;
}) => {
  return (
    <RadioGroup
      defaultValue={selectedService.id}
      onValueChange={(value) =>
        setSelectedService(services.find((service) => service.id === value))
      }
    >
      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-3">
          <RadioGroupItem value={service.id} id={service.id} />
          <Label htmlFor={service.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: service.color_hex }}
            />
            {service.name} - {service.duration} minutes
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

