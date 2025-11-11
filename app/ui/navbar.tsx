"use client";

import Link from "next/link";
import { useState } from "react";
import { FaGithubAlt } from "react-icons/fa";
import { AiTwotoneCloseCircle, AiOutlineMail, AiFillLinkedin } from "react-icons/ai";
import { RiMenuAddFill } from "react-icons/ri";
import { SiUbuntu, SiGnome } from "react-icons/si";
import CustomLink from "./CustomLink";
import DropDownLink from "./DropDownLink";
import Image from "next/image";

const navigation = [
    { routeName: "ABOUT", routeTo: "/" },
    { routeName: "OPEN SOURCE", routeTo: "/open-source" },
    { routeName: "PROJECTS", routeTo: "/projects" },
    { routeName: "CERTIFICATIONS", routeTo: "/certifications" },
    { routeName: "SKILLS", routeTo: "/skills" },
    { routeName: "CONTACT", routeTo: "/contact" },
];

const Navbar = () => {

    const [show, setShow] = useState<boolean>(false);

    return (
        <header className="bg-color-4 sticky top-0 w-full z-50">
            <nav className="h-[4rem] w-full max-w-7xl grid grid-cols-2 min-[475px]:grid-cols-3 sm:flex justify-between items-center p-2 mx-auto">
                <Link className="hidden min-[475px]:grid sm:flex h-full justify-center items-center text-color-3 hover:text-color-1 font-bold"
                    href={"/"}
                >
                    <Image src="coder.svg" alt="coder" width={60} height={60} priority />
                </Link>
                <button className="flex -order-1 sm:hidden text-white font-bold items-center justify-start text-xl cursor-pointer" onClick={() => setShow(!show)}>
                    {show ? <AiTwotoneCloseCircle fontSize={32} /> : <RiMenuAddFill fontSize={32} />}
                </button>
                <div className="hidden sm:flex h-full items-center justify-between gap-4 overflow-x-scroll flex-shrink [&::-webkit-scrollbar]:hidden text-nowrap">
                    {
                        navigation.map(item => (
                            <CustomLink
                                key={item.routeName}
                                routeTo={item.routeTo}
                                routeName={item.routeName}
                            />
                        ))
                    }
                </div>
                <div className="flex h-full justify-end items-center text-2xl text-white">
                    <a
                        href="mailto:pratap.panabaka@gmail.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Email to PRATAP"
                        className="p-1 text-lite hover:scale-125 hover:text-color-3"
                    >
                        <AiOutlineMail fontSize={24} />
                    </a>
                    <a
                        href="https://github.com/pratap-panabaka"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Github"
                        className="p-1 text-lite hover:scale-125 hover:text-color-3"
                    >
                        <FaGithubAlt fontSize={24} />
                    </a>
                    <a
                        href="https://linkedin.com/in/pratap-panabaka"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="p-1 text-lite hover:scale-125 hover:text-color-3"
                    >
                        <AiFillLinkedin fontSize={24} />
                    </a>
                    <a
                        href="https://askubuntu.com/users/739431/pratap-panabaka"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="p-1 text-lite hover:scale-125 hover:text-color-3"
                    >
                        <SiUbuntu fontSize={24} />
                    </a>
                    <a
                        href="https://extensions.gnome.org/accounts/profile/pratap-panabaka"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="p-1 text-lite hover:scale-125 hover:text-color-3"
                    >
                        <SiGnome fontSize={24} />
                    </a>
                </div>
            </nav >
            {
                show &&
                <div className="flex flex-col p-2 border-t border-toolite sm:hidden">
                    {
                        navigation.map(item => (
                            <DropDownLink
                                key={item.routeName}
                                routeTo={item.routeTo}
                                routeName={item.routeName}
                                onClick={async () => setShow(false)}
                            />
                        ))
                    }
                </div>
            }
        </header >
    )
}

export default Navbar;

