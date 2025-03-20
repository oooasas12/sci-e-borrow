import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

// Define props type
interface FilterListBoxProps {
    selected: string[]; // Selected items
    item: {id: number, name: string }[]; // List of all group items
    filter: (value: string) => void; // Function to filter selected group
    placeholder: string;
}

const FilterListBox: React.FC<FilterListBoxProps> = ({ selected, item, filter, placeholder }) => {
    return (
        <Listbox value={selected}>
            {({ open }) => (
                <div className={`relative ${open ? 'z-50' : 'z-10'} my-scroll`}>
                    {/* Listbox Button */}
                    <ListboxButton className="w-full px-2 h-9 py-1.5 flex items-center justify-center gap-3 rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                        <span className="text-sm flex items-center justify-between gap-4 w-full">
                            {placeholder} <IoIosArrowDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
                        </span>
                        {selected.length !== 0 && (
                            <div className="flex gap-1 items-center border-l-2 pl-3">
                                {selected.length > 2 ? (
                                    <div className="px-1 text-sm text-gray-500 bg-gray-300 rounded">
                                        3 ตัวเลือกขึ้นไป
                                    </div>
                                ) : (
                                    selected.map((item, index) => (
                                        <div
                                            className="px-1 text-sm text-gray-500 bg-gray-300 rounded"
                                            key={index}
                                        >
                                            {item}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </ListboxButton>

                    {/* Listbox Options */}
                    <ListboxOptions className="absolute mt-1 max-h-60 w-[200px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* Option: All */}
                        <ListboxOption
                            key="all"
                            value="all"
                            className={({ active }) =>
                                `cursor-pointer flex justify-between items-center select-none py-2 px-4 ${
                                    active ? 'bg-gray-100' : 'text-gray-900'
                                }`
                            }
                            onClick={() => filter('all')}
                        >
                            ทั้งหมด
                            <div className="w-[10%]">
                                {selected.length === 0 && <FaCheck />}
                            </div>
                        </ListboxOption>

                        {/* Dynamic Options */}
                        {item.map((item, index) => (
                            <ListboxOption
                                key={index}
                                value={item.name}
                                className={({ active }) =>
                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                    }`
                                }
                                onClick={(event) => {
                                    event.preventDefault();
                                    filter(item.name);
                                }}
                            >
                                {item.name}
                                <div className="w-[10%]">
                                    {selected.includes(item.name) && <FaCheck />}
                                </div>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            )}
        </Listbox>
    );
};

export default FilterListBox;
