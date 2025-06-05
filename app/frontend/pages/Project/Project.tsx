import { ProjectType } from "./types";

interface ProjectProps {
  project: ProjectType;
}

export default function Project({ project }: ProjectProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Title:</strong>
        {project.title?.toString()}
      </p>

      <p>{project.status ? project.status.title : "No status"}</p>
    </div>
  );
}

