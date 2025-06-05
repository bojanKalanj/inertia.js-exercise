import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { ProjectType } from './types'

interface EditProps {
  project: ProjectType
}

export default function Edit({ project }: EditProps) {
  return (
    <>
      <Head title="Editing project" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing project</h1>

        <Form
          project={project}
          onSubmit={(form) => {
            form.transform((data) => ({ project: data }))
            form.patch(`/projects/${project.id}`)
          }}
          submitText="Update Project"
        />

        <Link
          href={`/projects/${project.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Show this project
        </Link>
        <Link
          href="/projects"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to projects
        </Link>
      </div>
    </>
  )
}
