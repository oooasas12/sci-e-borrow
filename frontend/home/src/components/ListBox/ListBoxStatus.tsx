import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FaCheck } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define props type
interface ListBoxComponentProps {
    selectedValue: any; // Currently selected value
    options: { id: string | number, name: string }[]; // List of available options
    onChange: (value: string) => void; // Callback when value changes
    placeholder?: string; // Placeholder text when no value selected
    error?: string; // Error message (optional)
}

const ListBoxComponent: React.FC<ListBoxComponentProps> = ({
    selectedValue,
    options,
    onChange,
    placeholder,
    error,
}) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='p-1 rounded-full hover:bg-gray-200 text-center focus:outline-none'>
                    <HiOutlineDotsVertical className='text-gray-500 cursor-pointer' size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((item, index) => (
                    <DropdownMenuItem key={index} className='cursor-pointer flex items-center gap-2 justify-between' onClick={() => onChange(item.id.toString())}>
                        <span className='text-sm'>{item.name}</span>
                        <FaCheck className={`text-primary ${selectedValue == item.id ? 'opacity-100' : 'opacity-0'}`} size={16} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

    );
};

export default ListBoxComponent;
