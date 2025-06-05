import { Head, Link } from '@inertiajs/react'
import Status from './Status'
import { StatusType } from './types'

interface ShowProps {
  status: StatusType
  flash: { notice?: string }
}

export default function Show({ status, flash }: ShowProps) {
  return (
    <>
      <Head title={`Status #${status.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">Status #{status.id}</h1>

          <Status status={status} />

          <Link
            href={`/statuses/${status.id}/edit`}
            className="mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Edit this status
          </Link>
          <Link
            href="/statuses"
            className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Back to statuses
          </Link>
          <div className="inline-block ml-2">
            <Link
              href={`/statuses/${status.id}`}
              as="button"
              method="delete"
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium"
            >
              Destroy this status
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
