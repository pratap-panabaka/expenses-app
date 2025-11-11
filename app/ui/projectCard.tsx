"use client";

import { FaGithubAlt } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";

import ProjectCardModel from "@/models/projectCard";

const ProjectCard = ({ project }: { project: ProjectCardModel }) => {
    return (
        <div key={project.id} className="relative p-5 gap-2 w-full bg-color-5 border-2 border-color-5 shadow-lg flex flex-col items-center">
            <div className="grid grid-cols-1 border-b  p-2 bg-color-4 text-white md:grid-cols-2 md:grid-rows-2 w-full items-end h-auto">
                <p className="order-1">{project.name}</p>
                {project.from && <p className="order-2 md:order-3">{project.from} - {project.to}</p>}
                {project.company && <p className="text-left md:text-right order-3 md:order-2">{project.company}</p>}
                {project.role && <p className="text-left md:text-right order-4">{project.role}</p>}
            </div>
            <p className="w-full text-18 sm:text-20 md:text-22 text-color-4 my-5 px-2">{project.about}</p>
            <table className="table w-full border border-color-4">
                <tbody className="[&>*:nth-child(odd)]:bg-[#f8f8f8] [&>*:nth-child(even)]:bg-[#f9f9f9] bg-opacity-90">
                    {project.techs.map((tech) => (
                        <tr
                            key={`tech-${project.id}-${tech}`}
                            className="text-center tracking-widest border border-color-4"
                        >
                            <td className="inline-block">
                                <p className="font-black text-color-3">{tech}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex space-x-2 justify-end items-center w-full">
                {project.source && (
                    <a
                        href={project.source}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button type="button" className="btn">
                            <FaGithubAlt fontSize={24} /> Source
                        </button>
                    </a>
                )}
                {project.liveLink && (
                    <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button type="button" className="btn">
                            <LuExternalLink fontSize={24} /> Live
                        </button>
                    </a>
                )}
                <p className="absolute top-3 right-3 text-color-3 text-xs">{project.id}</p>
            </div>
        </div >
    )
}

export default ProjectCard;