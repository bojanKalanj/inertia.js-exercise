import { useQuery } from "@tanstack/react-query";
import { appointmentsQueriesFactory } from "../factories";

export const useGetAppointments = (
  companyId: string,
  serviceId: string,
  monthParam: string,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {
    enabled: true,
  }
) => {
  const { data, isLoading, isError } = useQuery(
    appointmentsQueriesFactory.getAppointments(
      companyId,
      serviceId,
      monthParam,
      {
        enabled,
      }
    )
  );

  return {
    appointments: data?.appointments,
    getAppointmentsQueryKey: appointmentsQueriesFactory.getAppointments(
      companyId,
      serviceId,
      monthParam,
      {
        enabled,
      }
    ).queryKey,
    appointmentsIsLoading: isLoading,
    isError,
    isLoadingAppointments: isLoading,
  };
};

