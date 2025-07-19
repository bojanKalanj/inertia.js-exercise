import Layout from "@/components/layout";

export default function Index({
  currentUser,
  session,
}: {
  currentUser: any;
  session: any;
}) {
  return (
    <Layout title="Home" currentUser={currentUser} session={session}>
      Home page
    </Layout>
  );
}

