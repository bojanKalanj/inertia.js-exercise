import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { StatusType } from './types'

interface EditProps {
  status: StatusType
}

export default function Edit({ status }: EditProps) {
  return (
    <>
      <Head title="Editing status" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing status</h1>

        <Form
          status={status}
          onSubmit={(form) => {
            form.transform((data) => ({ status: data }))
            form.patch(`/statuses/${status.id}`)
          }}
          submitText="Update Status"
        />

        <Link
          href={`/statuses/${status.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Show this status
        </Link>
        <Link
          href="/statuses"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to statuses
        </Link>
      </div>
    </>
  )
}
