import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { useState } from "react";

export const BookedAppointmentPopover = ({
  onCancelAppointment,
  appointment,
}: {
  onCancelAppointment: () => void;
  appointment: any;
}) => {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          style={{
            borderColor: appointment.service_color_hex
              ? appointment.service_color_hex
              : "",
          }}
        >
          {`${new Date(appointment.starts_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(appointment.ends_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {appointment.service_name}
            </h4>
            <p className="text-muted-foreground text-sm">
              {appointment.client_name}
            </p>

            <Dialog
              open={isConfirmationDialogOpen}
              onOpenChange={setIsConfirmationDialogOpen}
            >
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-4">
                    Cancel Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this appointment?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onCancelAppointment();
                        setIsConfirmationDialogOpen(false);
                      }}
                    >
                      Cancel Appointment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

