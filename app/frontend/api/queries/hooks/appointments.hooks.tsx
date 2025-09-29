import { useQuery } from "@tanstack/react-query";
import { appointmentsQueriesFactory } from "../factories";

export const useGetAppointments = (
  companyId: string,
  serviceId: string,
  monthParam: string
) => {
  const { data, isLoading, isError } = useQuery(
    appointmentsQueriesFactory.getAppointments(companyId, serviceId, monthParam)
  );

  return {
    appointments: data?.appointments,
    getAppointmentsQueryKey: appointmentsQueriesFactory.getAppointments(
      companyId,
      serviceId,
      monthParam
    ).queryKey,
    appointmentsIsLoading: isLoading,
    isError,
    isLoadingAppointments: isLoading,
  };
};

