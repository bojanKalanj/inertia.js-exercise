export interface ProjectType {
  id: number
  title: string
}

export type ProjectFormType = Omit<ProjectType, 'id'>
