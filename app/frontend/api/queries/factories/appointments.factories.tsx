import { queryOptions } from "@tanstack/react-query";
import AppointmentsApiService from "../services/appointments.service";

export const appointmentsQueriesFactory = {
  baseEntityKey: ["appointments"],
  getAppointments: (
    companyId: string,
    serviceId: string,
    monthParam: string,
    {
      enabled = true,
    }: {
      enabled?: boolean;
    }
  ) =>
    queryOptions({
      queryKey: [
        ...appointmentsQueriesFactory.baseEntityKey,
        "getAppointments",
        companyId,
        serviceId,
        monthParam,
      ],
      queryFn: async () => {
        const data = await AppointmentsApiService.getAppointments(
          companyId,
          serviceId,
          monthParam
        );
        return data;
      },
      enabled,
    }),
};

