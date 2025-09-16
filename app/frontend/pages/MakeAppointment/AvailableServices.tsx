import Layout from "@/components/layout";
import { Link } from "@inertiajs/react";

export default function AvailableServices({
  currentUser,
  session,
  company,
  available_services,
}: {
  currentUser: any;
  session: any;
  company: any;
  available_services: any;
}) {
  return (
    <Layout title="Step 1" currentUser={currentUser} session={session}>
      {JSON.stringify(company)}

      {JSON.stringify(available_services)}

      <li>
        {available_services.map((service: any) => (
          <Link
            href={`/companies/${company.id}/make-appointment/${service.id}/available-slots`}
          >
            {service.name}
          </Link>
        ))}
      </li>
    </Layout>
  );
}

