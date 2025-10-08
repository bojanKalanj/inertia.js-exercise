import { Link, Head, router } from "@inertiajs/react";
import {
  Provider,
  Root,
  Title,
  Description,
  Action,
  Close,
  Viewport,
} from "@radix-ui/react-toast";

export default function Layout({
  children,
  title,
  currentUser,
  session,
}: {
  children: React.ReactNode;
  title: string;
  currentUser?: any;
  session?: any;
}) {
  console.log({ session, currentUser });
  return (
    <Provider>
      <main>
        <Head title={title} />
        <header className="flex justify-between items-center p-4 bg-gray-100">
          <Link href="/">Home</Link>
          <div className="flex gap-4 items-center">
            {currentUser && session ? (
              <>
                <Link href="/profile" className="text-sm">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    router.delete(`/sessions/${session.id}`);
                  }}
                  className="text-sm hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/sign_in" className="text-sm">
                Sign in
              </a>
            )}
          </div>
        </header>
        <article className="p-4">{children}</article>
      </main>
      <Viewport />
    </Provider>
  );
}

