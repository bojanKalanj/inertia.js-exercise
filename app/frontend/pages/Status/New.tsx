import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { StatusType } from './types'

interface NewProps {
  status: StatusType
}

export default function New({ status }: NewProps) {
  return (
    <>
      <Head title="New status" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New status</h1>

        <Form
          status={status}
          onSubmit={(form) => {
            form.transform((data) => ({ status: data }))
            form.post('/statuses')
          }}
          submitText="Create Status"
        />

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
