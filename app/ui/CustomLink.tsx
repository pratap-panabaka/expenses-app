"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const CustomLink = ({ routeName, routeTo }: { routeName: string, routeTo: string }) => {

    const pathName = usePathname();

    const isActive = pathName === routeTo;

    return (
        <Link
            href={routeTo}
            className={classNames(
                isActive
                    ? "text-color-3"
                    : "text-white"
                ,
                "px-2 py-1 font-bold text-m-6 hover:text-color-2",
            )}
        >
            {routeName}
        </Link >
    );
};

export default CustomLink

