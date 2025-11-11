import React from "react";
import skillsData from "@/data/skillsData";

function Skills() {
  return (
    <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-color-1">
      <div className="flex p-4 flex-col gap-4 items-center max-w-6xl justify-center grow">
        {skillsData.map((obj) => (
          <div key={obj.id} className="w-full shadow-3xl rounded-3xl">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-4 p-5 items-center justify-center bg-color-5 rounded-t-3xl">
                {[...obj.skills.entries()].map(([key, icon]) => (
                  <div key={key} className="flex flex-col space-y-2 justify-center rounded-lg p-2 items-center text-[16px] min-[480px]:text-base">
                    {React.createElement(icon, { fontSize: 36, color: "#164863" })}
                    <p className="text-color-4">{key}</p>
                  </div>
                ))}
              </div>
              <div className="font-bold p-2 flex items-center justify-center text-center bg-color-4 text-white rounded-b-3xl">
                {obj.skill}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
