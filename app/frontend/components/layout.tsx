import { Link, Head, router } from "@inertiajs/react";

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
  return (
    <main>
      <Head title={title} />
      <header className="flex justify-between items-center p-4 bg-gray-100">
        <Link href="/" className="text-2xl font-bold">
          Home
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/about" className="text-2xl font-bold">
            About
          </Link>

          {currentUser ? (
            <>
              <Link href="/profile" className="text-2xl font-bold">
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
      <article>{children}</article>
    </main>
  );
}

