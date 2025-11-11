"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

/* eslint-disable  @typescript-eslint/no-empty-object-type */
const DropDownLink = ({ routeName, routeTo, onClick }: { routeName: string, routeTo: string, onClick: () => {} }) => {

    const pathName = usePathname();
    const isActive = pathName === routeTo;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClick();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClick]);

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
            onClick={onClick}
        >
            {routeName}
        </Link >
    );
};

export default DropDownLink;

