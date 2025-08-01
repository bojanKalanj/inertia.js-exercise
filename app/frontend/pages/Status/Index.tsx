import { Head, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import Status from './Status'
import { StatusType } from './types'

interface IndexProps {
  statuses: StatusType[]
  flash: { notice?: string }
}

export default function Index({ statuses, flash }: IndexProps) {
  return (
    <>
      <Head title="Statuses" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Statuses</h1>
          <Link
            href="/statuses/new"
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New status
          </Link>
        </div>

        <div className="min-w-full">
          {statuses.map((status) => (
            <Fragment key={status.id}>
              <Status status={status} />
              <p>
                <Link
                  href={`/statuses/${status.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this status
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
