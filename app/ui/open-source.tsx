
import OpensourceCard from "@/app/ui/opensourceCard";
import openSource from '@/data/openSource';

import {
    SiGnome,
    SiXubuntu,
    SiUbuntu,
} from "react-icons/si";

const icons = [SiGnome, SiUbuntu, SiXubuntu]

const OpenSource = () => {
    return (
        <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-color-1">
            <div className="flex flex-col gap-4 p-4 max-w-6xl w-full">
                {
                    openSource.map((project, idx) => (
                        <OpensourceCard project={project} Icon={icons[idx]} key={project.id} />
                    ))
                }
            </div>
        </div>
    );
}

export default OpenSource;
