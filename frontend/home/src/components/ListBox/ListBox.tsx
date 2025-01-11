import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa';

// Define props type
interface ListBoxComponentProps {
    selectedValue: string | null; // Currently selected value
    options: { name: string }[]; // List of available options
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
    console.log(selectedValue);
    
    return (
        <Listbox value={selectedValue} onChange={onChange}>
            <div className="relative z-10 my-scroll">
                {/* Listbox Button */}
                <ListboxButton className="w-full px-2 h-9 py-1 flex items-center justify-start gap-3 rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                    <span className="text-sm">{selectedValue || placeholder}</span>
                </ListboxButton>

                {/* Listbox Options */}
                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {options.map((item, index) => (
                        <ListboxOption
                            key={index}
                            value={item.name}
                            className={({ active }) =>
                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${
                                    active ? 'bg-gray-100' : 'text-gray-900'
                                }`
                            }
                        >
                            {item.name}
                            {selectedValue === item.name && (
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
        </Listbox>
    );
};

export default ListBoxComponent;
