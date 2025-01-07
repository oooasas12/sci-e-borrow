"use client";

import React from "react";
import { useRouter } from 'next/navigation'
import { Listbox, ListboxButton } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

type ListBoxData = {
    name: string;
};

export const ListBoxComponent = ({
    name
}: ListBoxData) => {

    return (
        <Listbox >
            <div className="relative z-auto my-scroll">
                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                    <span className='text-sm flex items-center justify-between w-full gap-4'>{name}<IoIosArrowDown /></span>
                </ListboxButton>
            </div>
        </Listbox>
    );
};

export default ListBoxComponent;
