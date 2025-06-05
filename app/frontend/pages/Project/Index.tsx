import { Head, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import Project from './Project'
import { ProjectType } from './types'

interface IndexProps {
  projects: ProjectType[]
  flash: { notice?: string }
}

export default function Index({ projects, flash }: IndexProps) {
  return (
    <>
      <Head title="Projects" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Projects</h1>
          <Link
            href="/projects/new"
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New project
          </Link>
        </div>

        <div className="min-w-full">
          {projects.map((project) => (
            <Fragment key={project.id}>
              <Project project={project} />
              <p>
                <Link
                  href={`/projects/${project.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this project
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
