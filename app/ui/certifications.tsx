"use client";

import { useEffect, useState } from "react";

import certificatesData from "@/data/certificatesData";

const reversedData = [...certificatesData].reverse();

const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

const Certifications = () => {

    const [code, setCode] = useState<string>("ALL");
    const [data, setData] = useState(reversedData);

    const handleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        setCode(e.currentTarget.id);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        if (code === "ALL") {
            setData(reversedData);
        } else {
            setData(reversedData.filter((o) => o.code === code));
        }
    }, [code])

    return (
        <div className="flex justify-center min-h-[calc(100vh-4rem)] bg-color-1">
            <div className="flex flex-col p-4 items-center max-w-6xl w-full mx-auto justify-start grow">
                <div className="sticky z-40 top-[4rem] w-fit p-2 rounded-lg mx-auto h-12 bg-color-4 text-white flex items-center border-t justify-center space-x-4">
                    <button id="ALL" onClick={handleFilter} className={`px-4 py-1 text-lite font-bold hover:text-color-2 rounded-lg cursor-pointer ${code === 'ALL' ? 'text-color-3' : null}`}>All</button>
                    <button id="MV" onClick={handleFilter} className={`px-4 py-1 text-lite font-bold hover:text-color-2 rounded-lg cursor-pointer ${code === 'MV' ? 'text-color-3' : null} `}>Microverse</button>
                    <button id="HR" onClick={handleFilter} className={`px-4 py-1 text-lite font-bold hover:text-color-2 rounded-lg cursor-pointer ${code === 'HR' ? 'text-color-3' : null} `}>Hacker Rank</button>
                </div>
                <div className="p-4 grid gap-4 sm:grid-cols-2 w-full">
                    {
                        data.map((certificate, idx) => (
                            <a
                                key={certificate.id}
                                href={certificate.link}
                                target="_blank"
                                rel="noreferrer"
                                className="relative"
                            >
                                <p className="absolute top-2 right-2 text-color-3 text-xs">{data.length - idx}</p>
                                <div>
                                    <div className={`bg-color-5 rounded-t-2xl text-color-4 w-full min-h-[100px] flex justify-center items-center font-bold p-2 text-center ${certificate.category ? 'text-color-3' : null}`}>
                                        {certificate.name}
                                    </div>
                                    <div className="text-sm bg-color-4 text-white rounded-b-2xl p-2 w-full flex flex-col items-center justify-center text-color-4">
                                        <p className="text-center">{certificate.issuer}</p>
                                        <p className="text-center">{certificate.date.toLocaleDateString("en-US", options)}</p>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Certifications;