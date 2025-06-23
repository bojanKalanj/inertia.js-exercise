import { Head } from "@inertiajs/react";

interface UserType {
  id: number;
  email: string;
}

interface Props {
  currentUser: UserType;
}

export default function Index({ currentUser }: Props) {
  return (
    <>
      <Head title="Profile" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Profile</h1>
        </div>

        <div className="mt-8">
          <p className="text-green-600 mb-4">Signed as {currentUser.email}</p>

          <h2 className="text-2xl font-semibold mb-4">
            Login and verification
          </h2>

          <div className="space-y-2 mb-6">
            <a
              href="/password/edit"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Change password
            </a>
          </div>

          <div className="space-y-2 mb-6">
            <a
              href="/identity/email/edit"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Change email address
            </a>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Access history</h2>

          <div className="space-y-2 mb-6">
            <a
              href="/sessions"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Devices & Sessions
            </a>
          </div>

          <div className="mt-8">
            <form method="post" action={`/sessions/${currentUser.id}`}>
              <input type="hidden" name="_method" value="delete" />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

