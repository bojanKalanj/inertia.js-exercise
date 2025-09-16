import Layout from "@/components/layout";

export default function AvailableSlots({
  currentUser,
  session,
  company,
  available_slots,
}: {
  currentUser: any;
  session: any;
  company: any;
  available_slots: any;
}) {
  return (
    <Layout title="Step 1" currentUser={currentUser} session={session}>
      {JSON.stringify(company)}

      {JSON.stringify(available_slots)}
    </Layout>
  );
}

