import OpensourceCardModel from "@/models/opensourceCard";
import { IconType } from 'react-icons';

const OpensourceCard = ({ project, Icon }: { project: OpensourceCardModel, Icon: IconType }) => {
    return (
        <div key={project.id} className="relative p-5 gap-2 w-full bg-color-5 flex flex-col items-center bg-opacity-90">
            <div className="grid grid-cols-1 border-b p-2 bg-color-4 text-white w-full">
                <p>{project.name}</p>
                {project.from && <p>{project.from} - {project.to}</p>}
            </div>
            <p className="w-full text-18 sm:text-20 md:text-22 text-color-4 my-5 px-2">{project.about}</p>
            <div className="flex space-x-2 justify-end items-center w-full">
                <a
                    href={project.source}
                    target="_blank"
                    rel="noreferrer"
                >
                    <button type="button" className="btn">
                        <Icon fontSize={24} /> Source
                    </button>
                </a>
                <p className="absolute top-3 right-3 text-color-3 text-xs">{project.id}</p>
            </div>
        </div>
    )
}

export default OpensourceCard;
