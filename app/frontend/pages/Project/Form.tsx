import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { ProjectFormType, ProjectType } from "./types";
import { StatusType } from "../Status/types";

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface FormProps {
  project: ProjectType;
  statuses?: StatusType[];
  onSubmit: (form: InertiaFormProps<ProjectFormType>) => void;
  submitText: string;
}

export default function Form({
  project,
  statuses = [],
  onSubmit,
  submitText,
}: FormProps) {
  const form = useForm<ProjectFormType>({
    title: project.title,
    status_id: project.status_id,
  });
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={data.title}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("title", e.target.value)}
        />
        {errors.title && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.title}
          </div>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="status_id">Status</label>
        <select
          name="status_id"
          id="status_id"
          value={data.status_id}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("status_id", Number(e.target.value))}
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.title}
            </option>
          ))}
        </select>
        {errors.status_id && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.status_id}
          </div>
        )}
      </div>

      <div className="inline">
        <button
          type="submit"
          disabled={processing}
          className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}

