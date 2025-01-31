import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

// Define props type
interface ListBoxComponentProps {
    selectedValue: any; // Currently selected value
    options: { id: string | number, name: string }[]; // List of available options
    onChange: (value: any) => void; // Callback when value changes
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
        <Listbox value={selectedValue} onChange={onChange}>
            {({ open }) => (
                <div className={`relative ${open ? 'z-20' : 'z-10'} my-scroll`}>
                    {/* Listbox Button */}
                    <ListboxButton className="w-full px-2 h-9 py-1 flex items-center justify-between gap-3 rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                        <span className="text-sm">{options.find(item => item.id == selectedValue.id)?.name || placeholder}</span>
                        <IoIosArrowDown />
                    </ListboxButton>

                    {/* Listbox Options */}
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {options.map((item, index) => (
                            <ListboxOption
                                key={index}
                                value={item}
                                className={({ active }) =>
                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'
                                    }`
                                }
                            >
                                {item.name}
                                {selectedValue.id === item.id && (
                                    <div className="ml-auto">
                                        <FaCheck />
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>

                    {/* Error Message */}
                    {error && <span className="text-red-500 text-sm">{error}</span>}
                </div>
            )}
        </Listbox>

    );
};

export default ListBoxComponent;
