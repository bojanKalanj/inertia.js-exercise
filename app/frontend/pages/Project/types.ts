export interface ProjectType {
  id: number;
  title: string;
  status_id: number;
}

export type ProjectFormType = Omit<ProjectType, "id">;

