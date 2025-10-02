import Layout from "@/components/layout";

export default function Index({
  currentUser,
  session,
  companies,
  services,
}: {
  currentUser: any;
  session: any;
  companies: any;
  services: any;
}) {
  return (
    <Layout title="Home" currentUser={currentUser} session={session}>
      <div>
        {companies.map((company: any) => (
          <div key={company.id}>
            <div className="flex flex-row justify-between gap-5 mt-5">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {company.name}
              </h4>
              <a
                href={`/companies/${company.id}/edit`}
                className="text-sm hover:underline"
              >
                Edit Company
              </a>
            </div>

            {services.map((service: any) => (
              <div
                key={service.id}
                className="flex flex-row justify-between gap-5 mt-5"
              >
                <a
                  href={`/companies/${company.id}/services/${service.id}/appointments/available-slots`}
                >
                  <h5 className="scroll-m-20 text-sm font-semibold tracking-tight flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: service.color_hex }}
                    />
                    {service.name}
                  </h5>
                </a>

                <a
                  href={`/companies/${company.id}/services/${service.id}/edit`}
                  className="text-sm hover:underline"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end">
          <a
            href={`/companies/${companies[0].id}/services/new`}
            className="text-sm hover:underline mt-5"
          >
            Add Service
          </a>
        </div>
      </div>
    </Layout>
  );
}

