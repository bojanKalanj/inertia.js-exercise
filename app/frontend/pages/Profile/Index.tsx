import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

interface UserType {
  id: number;
  email: string;
  avatar_url?: string;
  avatar_thumbnail_url?: string;
  avatar_medium_url?: string;
}

interface Props {
  currentUser: UserType;
}

export default function Index({ currentUser }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, setData, patch, progress, errors } = useForm<{
    avatar: File | null;
  }>({
    avatar: null,
  });

  const { delete: deleteAvatar, processing: deletingAvatar } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("avatar", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    patch("/profile", {
      onSuccess: () => {
        console.log("success");
        setPreviewUrl(null);
      },
      forceFormData: true,
    });
  }

  const handleRemoveAvatar = () => {
    deleteAvatar("/profile/avatar", {
      method: "delete",
    });
  };

  // Use current avatar or preview
  const displayAvatar =
    previewUrl || currentUser.avatar_thumbnail_url || currentUser.avatar_url;
  const hasAvatar = currentUser.avatar_url || currentUser.avatar_thumbnail_url;

  return (
    <>
      <Head title="Profile" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Profile</h1>
        </div>

        <div className="mt-8">
          <p className="text-green-600 mb-4">Signed as {currentUser.email}</p>

          {/* Avatar Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Avatar</h2>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">
                      {currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={submit} className="flex-1">
                <div className="mb-4">
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.avatar && (
                    <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                  )}
                </div>

                {data.avatar && (
                  <button
                    type="submit"
                    disabled={progress?.percentage !== undefined}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    {progress?.percentage !== undefined
                      ? "Uploading..."
                      : "Upload Avatar"}
                  </button>
                )}

                {hasAvatar && !data.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={deletingAvatar}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded"
                  >
                    {deletingAvatar ? "Removing..." : "Remove Avatar"}
                  </button>
                )}
              </form>
            </div>

            {progress && (
              <div className="mt-4">
                <progress
                  value={progress.percentage}
                  max="100"
                  className="w-full"
                >
                  {progress.percentage}%
                </progress>
              </div>
            )}
          </div>

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

