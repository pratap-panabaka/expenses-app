import ProjectCard from "@/app/ui/projectCard";
import projectsData from "@/data/projectsData";

const Projects = () => (
    <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-color-1">
        <div className="flex items-center max-w-6xl w-full mx-auto justify-center">
            <div className="flex flex-col gap-4 p-4 w-full">
                {
                    projectsData.map((project) => (
                        <ProjectCard project={project} key={project.id} />
                    ))
                }
            </div>
        </div>
    </div>
);

export default Projects;
