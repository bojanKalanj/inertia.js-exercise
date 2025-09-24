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
        <div className="flex items-center gap-3">
          <RadioGroupItem value={service.id} id={service.id} />
          <Label htmlFor={service.id}>
            {service.name} - {service.duration} minutes
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

