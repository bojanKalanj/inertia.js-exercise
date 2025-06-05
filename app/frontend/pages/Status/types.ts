export interface StatusType {
  id: number
  title: string
  key: string
}

export type StatusFormType = Omit<StatusType, 'id'>
