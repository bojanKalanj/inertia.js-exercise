import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import { StatusFormType, StatusType } from './types'

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<typeof useForm<TForm>>

interface FormProps {
  status: StatusType
  onSubmit: (form: InertiaFormProps<StatusFormType>) => void
  submitText: string
}

export default function Form({ status, onSubmit, submitText }: FormProps) {
  const form = useForm<StatusFormType>({
    title: status.title,
    key: status.key,
  })
  const { data, setData, errors, processing } = form

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

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
          onChange={(e) => setData('title', e.target.value)}
        />
        {errors.title && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.title}
          </div>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="key">Key</label>
        <input
          type="text"
          name="key"
          id="key"
          value={data.key}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData('key', e.target.value)}
        />
        {errors.key && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.key}
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
  )
}
