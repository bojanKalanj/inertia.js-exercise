import { Head, Link } from '@inertiajs/react'
import Project from './Project'
import { ProjectType } from './types'

interface ShowProps {
  project: ProjectType
  flash: { notice?: string }
}

export default function Show({ project, flash }: ShowProps) {
  return (
    <>
      <Head title={`Project #${project.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">Project #{project.id}</h1>

          <Project project={project} />

          <Link
            href={`/projects/${project.id}/edit`}
            className="mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Edit this project
          </Link>
          <Link
            href="/projects"
            className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Back to projects
          </Link>
          <div className="inline-block ml-2">
            <Link
              href={`/projects/${project.id}`}
              as="button"
              method="delete"
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium"
            >
              Destroy this project
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
