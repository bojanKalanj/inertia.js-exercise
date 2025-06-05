import { StatusType } from "../Status/types";

export interface ProjectType {
  id: number;
  title: string;
  status_id: number;
  status?: StatusType;
}

export type ProjectFormType = Omit<ProjectType, "id">;

