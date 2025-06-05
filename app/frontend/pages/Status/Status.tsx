import { StatusType } from './types'

interface StatusProps {
  status: StatusType
}

export default function Status({ status }: StatusProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Title:</strong>
        {status.title?.toString()}
      </p>
      <p className="my-5">
        <strong className="block font-medium mb-1">Key:</strong>
        {status.key?.toString()}
      </p>
    </div>
  )
}
