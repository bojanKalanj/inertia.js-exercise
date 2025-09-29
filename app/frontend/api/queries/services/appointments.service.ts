class AppointmentsApiService {
  static async getAppointments(
    companyId: string,
    serviceId: string,
    monthParam: string
  ) {
    const response = await fetch(
      `/companies/${companyId}/services/${serviceId}/appointments/monthly-appointments?month=${monthParam}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  }
}

export default AppointmentsApiService;

