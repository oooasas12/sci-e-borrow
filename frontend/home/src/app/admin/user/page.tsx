"use client";
import React, { useEffect, useState } from 'react';
import Layout from '@/Layouts/default';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useForm, SubmitHandler } from "react-hook-form"
import { CheckIcon } from 'lucide-react';
import ButtonPrimary from '@/components/button/buttonPrimary';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from '@/components/pagination/PaginationList';

type Inputs = {
    name: String,
    username: String,
    password: String,
    fac: String,
    group: String,
    branch: String
}

const ReportPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([
        { id: 1, name: 'name 1', username: 'username 1', password: 'password 1', fac: 'รองแผน', group: 'วิทยาการคอม', branch: 'อาจารย์ประจำสาขา' },
        { id: 2, name: 'name 2', username: 'username 2', password: 'password 2', fac: 'อาจารย์', group: 'วิทยาการคอม', branch: 'ประธานหลักสูตร' },
        { id: 3, name: 'name 3', username: 'username 3', password: 'password 3', fac: 'อาจารย์', group: 'มัลติ', branch: 'ประธานหลักสูตร' },
        { id: 4, name: 'name 4', username: 'username 4', password: 'password 4', fac: 'เจ้าหน้าที่', group: 'มัลติ', branch: 'อาจารย์ประจำสาขา' },
        { id: 5, name: 'name 5', username: 'username 5', password: 'password 5', fac: 'เจ้าหน้าที่', group: 'พยาบาล', branch: 'ประธานสาขา' },
        { id: 6, name: 'name 6', username: 'username 6', password: 'password 6', fac: 'เจ้าหน้าที่', group: 'มัลติ', branch: 'ประธานสาขา' },
        { id: 7, name: 'name 7', username: 'username 7', password: 'password 7', fac: 'อาจารย์', group: 'วิทยาการคอม', branch: 'อาจารย์ประจำสาขา' },
        { id: 8, name: 'name 8', username: 'username 8', password: 'password 8', fac: 'อาจารย์', group: 'พยาบาล', branch: 'อาจารย์ประจำสาขา' },
    ]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectGroup, setSelectGroup] = useState<string[]>([]);
    const [selectFac, setSelectFac] = useState<string[]>([]);
    const [selectBranch, setSelectBranch] = useState<string[]>([]);
    const [selectedFilterGroup, setSelectedFilterGroup] = useState<string[]>([]);
    const [selectedFilterFac, setSelectedFilterFac] = useState<string[]>([]);
    const [selectedFilterBranch, setSelectedFilterBranch] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedFac, setSelectedFac] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [errorInput, setErrorInput] = useState({
        fac: false,
        group: false,
        branch: false
    });
    const [editData, setEditData] = useState<Inputs>();
    const [delData, setDelData] = useState({
        index: 0,
        name: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const group = [
        { id: 1, name: 'วิทยาการคอม' },
        { id: 2, name: 'มัลติ' },
        { id: 3, name: 'พยาบาล' }
    ];

    const fac = [
        { id: 1, name: 'รองแผน' },
        { id: 2, name: 'เจ้าหน้าที่' },
        { id: 3, name: 'อาจารย์' },
    ];

    const branch = [
        { id: 1, name: 'ประธานหลักสูตร' },
        { id: 2, name: 'ประธานสาขา' },
        { id: 3, name: 'อาจารย์ประจำสาขา' },
    ]

    useEffect(() => {
        let results = data
        if (selectedFilterGroup.length != 0) {
            results = results.filter(item => selectedFilterGroup.includes(item.group.toLowerCase()))
        }
        if (selectedFilterFac.length != 0) {
            results = results.filter(item => selectedFilterFac.includes(item.fac.toLowerCase()))
        }
        if (selectedFilterBranch.length != 0) {
            results = results.filter(item => selectedFilterBranch.includes(item.branch.toLowerCase()))
        }
        results = results.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.password.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(results);
    }, [searchTerm, selectedFilterGroup, selectedFilterFac, selectedFilterBranch]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterGroup = (value: string) => {
        if (value === 'all') {
            setSelectedFilterGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterGroup.includes(value)) {
            setSelectedFilterGroup(selectedFilterGroup.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterGroup([...selectedFilterGroup, value]);
        }
    }

    const filterFac = (value: string) => {
        if (value === 'all') {
            setSelectedFilterFac([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterFac.includes(value)) {
            setSelectedFilterFac(selectedFilterFac.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterFac([...selectedFilterFac, value]);
        }
    }

    const filterBranch = (value: string) => {
        if (value === 'all') {
            setSelectedFilterBranch([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterBranch.includes(value)) {
            setSelectedFilterBranch(selectedFilterBranch.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterBranch([...selectedFilterBranch, value]);
        }
    }

    const onSubmit = (data: Inputs) => {
        console.log(data);
        if (!data.branch) {
            setErrorInput({ ...errorInput, branch: true });
            return;
        }
        if (!data.fac) {
            setErrorInput({ ...errorInput, fac: true });
            return;
        }
        if (!data.group) {
            setErrorInput({ ...errorInput, group: true });
            return;
        }
        setErrorInput({
            branch: false,
            fac: false,
            group: false
        });
        setSelectedGroup('');
        setSelectedFac('');
        setSelectedBranch('');
        setOpenInsertData(false)
        console.log(data);
    };

    const handleEdit = (data: any) => {
        console.log("Edit data: ", data);
        setEditData(data);
        setOpenEditData(true);
        setSelectBranch(data.branch)
        setSelectFac(data.fac)
        setSelectGroup(data.group)
    }

    const handleDel = (index: number, name: string) => {
        console.log("del index: ", index);
        setDelData({
            index: index,
            name: name
        });
        setOpenDelData(true);
    }

    const closeModalDel = () => {
        setOpenDelData(false);
    }

    const perPageSelectorHandler = (perPage: number) => {
        setCurrentPage(1)
        setPerPage(perPage)
    }

    const pageDirectHandler = (index: number) => {
        setCurrentPage(index + 1)
    }

    return (
        <Layout>
            <div className='container'>
                <h1 className='title lg text-font_color'>บัญชีผู้ใช้</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Input
                                type="text"
                                placeholder="ค้นหา..."
                                className='min-w-[250px] w-[300px] bg-white'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Listbox value={selectedFilterGroup}>
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap'>กลุ่มงาน / สาขา</span>
                                        {selectedFilterGroup.length != 0 && (
                                            <div className='flex gap-1 items-center border-l-2 pl-3'>
                                                {selectedFilterGroup.length > 2 ? (
                                                    <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded' >3 ตัวเลือกขึ้นไป</div>
                                                ) : (
                                                    selectedFilterGroup.map((item, index) => (
                                                        <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded line-clamp-1' key={index}>{item}</div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </ListboxButton>
                                    <ListboxOptions className="absolute mt-1 max-h-60 w-[160px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <ListboxOption
                                            key="all"
                                            value="all"
                                            className={({ active }) =>
                                                `cursor-pointer flex justify-between items-center select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                }`
                                            }
                                            onClick={() => filterGroup('all')}
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterGroup.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
                                        {group.map((item, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={item}
                                                className={({ active }) =>
                                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                    }`
                                                }
                                                onClick={(event) => { event.preventDefault(), filterGroup(item.name) }}
                                            >
                                                {item.name}
                                                <div className='w-[10%]'>
                                                    {selectedFilterGroup.includes(item.name) && (
                                                        <FaCheck />
                                                    )}
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            <Listbox value={selectedFilterFac}>
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap'>ตำแหน่งระดับคณะ</span>
                                        {selectedFilterFac.length != 0 && (
                                            <div className='flex gap-1 items-center border-l-2 pl-3'>
                                                {selectedFilterFac.length > 2 ? (
                                                    <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded' >3 ตัวเลือกขึ้นไป</div>
                                                ) : (
                                                    selectedFilterFac.map((item, index) => (
                                                        <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded line-clamp-1' key={index}>{item}</div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </ListboxButton>
                                    <ListboxOptions className="absolute mt-1 max-h-60 w-[160px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <ListboxOption
                                            key="all"
                                            value="all"
                                            className={({ active }) =>
                                                `cursor-pointer flex justify-between items-center select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                }`
                                            }
                                            onClick={() => filterFac('all')}
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterFac.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
                                        {fac.map((item, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={item}
                                                className={({ active }) =>
                                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                    }`
                                                }
                                                onClick={(event) => { event.preventDefault(), filterFac(item.name) }}
                                            >
                                                {item.name}
                                                <div className='w-[10%]'>
                                                    {selectedFilterFac.includes(item.name) && (
                                                        <FaCheck />
                                                    )}
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            <Listbox value={selectedFilterBranch}>
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap'>ตำแหน่งระดับสาขา</span>
                                        {selectedFilterBranch.length != 0 && (
                                            <div className='flex gap-1 items-center border-l-2 pl-3'>
                                                {selectedFilterBranch.length > 2 ? (
                                                    <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded' >3 ตัวเลือกขึ้นไป</div>
                                                ) : (
                                                    selectedFilterBranch.map((item, index) => (
                                                        <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded line-clamp-1' key={index}>{item}</div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </ListboxButton>
                                    <ListboxOptions className="absolute mt-1 max-h-60 w-[160px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <ListboxOption
                                            key="all"
                                            value="all"
                                            className={({ active }) =>
                                                `cursor-pointer flex justify-between items-center select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                }`
                                            }
                                            onClick={() => filterBranch('all')}
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterBranch.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
                                        {branch.map((item, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={item}
                                                className={({ active }) =>
                                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                    }`
                                                }
                                                onClick={(event) => { event.preventDefault(), filterBranch(item.name) }}
                                            >
                                                {item.name}
                                                <div className='w-[10%]'>
                                                    {selectedFilterBranch.includes(item.name) && (
                                                        <FaCheck />
                                                    )}
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        </div>
                        <div className='flex'>
                            <button onClick={() => setOpenInsertData(true)} className='bg-primary_1 whitespace-nowrap hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>เพิ่มรายการ</span>
                            </button>
                        </div>
                    </div>
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className=' whitespace-nowrap'>#</TableHead>
                                <TableHead className=' whitespace-nowrap'>ชื่อ-สกุล</TableHead>
                                <TableHead className=' whitespace-nowrap'>username</TableHead>
                                <TableHead className=' whitespace-nowrap'>password</TableHead>
                                <TableHead className=' whitespace-nowrap'>กลุ่มงาน / สาขา</TableHead>
                                <TableHead className=' whitespace-nowrap'>ตำแหน่งระดับคณะ</TableHead>
                                <TableHead className=' whitespace-nowrap'>ตำแหน่งระดับสาขา</TableHead>
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.slice(
                                currentPage * perPage - perPage,
                                currentPage * perPage
                            ).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.password}</TableCell>
                                    <TableCell>{item.group}</TableCell>
                                    <TableCell>{item.fac}</TableCell>
                                    <TableCell>{item.branch}</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' size={20} onClick={() => handleEdit(item)} />
                                        <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDel(item.id, item.name)} size={20} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className='flex justify-between w-full'>
                        <PaginationList
                            current_page={currentPage}
                            items_per_page={perPage}
                            total_item={filteredData.length}
                            onPerPageSelector={perPageSelectorHandler}
                            pageDirectHandler={pageDirectHandler} />
                    </div>
                </div>
            </div>
            <Dialog open={openInsertData} onClose={() => setOpenInsertData(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        เพิ่มรายการผู้ใช้
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>ชื่อ-สกุล</label>
                                        <Input
                                            type="text"
                                            placeholder="ชื่อ-สกุล"
                                            {...register('name', { required: 'โปรดกรอกชื่อ-สกุล' })}
                                        />
                                        {errors.name && (
                                            <span className="text-red-500 text-sm">{errors.name.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="username" className='text-sm text-font_color'>Username</label>
                                        <Input
                                            type="text"
                                            placeholder="username"
                                            {...register('username', { required: 'โปรดกรอก Username' })}
                                        />
                                        {errors.username && (
                                            <span className="text-red-500 text-sm">{errors.username.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="password" className='text-sm text-font_color'>Password</label>
                                        <Input
                                            type="text"
                                            placeholder="password"
                                            {...register('password', { required: 'โปรดกรอก Password' })}
                                        />
                                        {errors.password && (
                                            <span className="text-red-500 text-sm">{errors.password.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มงาน / สาขา</label>
                                        <Listbox value={selectedGroup}
                                            onChange={(value) => {
                                                setSelectedGroup(value);
                                                setValue('group', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedGroup || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {group.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedGroup === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.group && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกกลุ่มงาน / สาขา</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="fac" className='text-sm text-font_color'>ตำแหน่งระดับคณะ</label>
                                        <Listbox value={selectedFac}
                                            onChange={(value) => {
                                                setSelectedFac(value);
                                                setValue('fac', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedFac || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {fac.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedFac === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.fac && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกตำแหน่งระดับคณะ</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="branch" className='text-sm text-font_color'>ตำแหน่งระดับสาขา</label>
                                        <Listbox value={selectedBranch}
                                            onChange={(value) => {
                                                setSelectedBranch(value);
                                                setValue('branch', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedBranch || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {branch.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedBranch === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.branch && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกตำแหน่งระดับสาขา</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <Dialog open={openEditData} onClose={() => setOpenEditData(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        เพิ่มรายการผู้ใช้
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>ชื่อ-สกุล</label>
                                        <Input
                                            type="text"
                                            placeholder="ชื่อ-สกุล"
                                            onChange={(e) => setValue('name', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>Username</label>
                                        <Input
                                            type="text"
                                            placeholder="username"
                                            onChange={(e) => setValue('username', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>Password</label>
                                        <Input
                                            type="text"
                                            placeholder="password"
                                            onChange={(e) => setValue('password', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มงาน / สาขา</label>
                                        <Listbox value={selectedGroup}
                                            onChange={(value) => {
                                                setSelectedGroup(value);
                                                setValue('group', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedGroup || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {group.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedGroup === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.group && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกกลุ่มงาน / สาขา</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="fac" className='text-sm text-font_color'>ตำแหน่งระดับคณะ</label>
                                        <Listbox value={selectedFac}
                                            onChange={(value) => {
                                                setSelectedFac(value);
                                                setValue('fac', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedFac || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {fac.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedFac === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.fac && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกตำแหน่งระดับคณะ</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="branch" className='text-sm text-font_color'>ตำแหน่งระดับสาขา</label>
                                        <Listbox value={selectedBranch}
                                            onChange={(value) => {
                                                setSelectedBranch(value);
                                                setValue('branch', value); // Update useForm state
                                            }}>
                                            <div className="relative z-auto my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedBranch || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {branch.map((item, index) => (
                                                        <ListboxOption
                                                            key={index}
                                                            value={item.name}
                                                            className={({ active }) =>
                                                                `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100 ' : 'text-gray-900'
                                                                }`
                                                            }
                                                        >
                                                            {item.name}
                                                            <div className='w-[10%]'>
                                                                {selectedBranch === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput.branch && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกตำแหน่งระดับสาขา</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <Dialog open={openDelData} onClose={() => setOpenDelData(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        ลบรายการผู้ใช้
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenDelData(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-font_color'>คุณต้องการลบรายการผู้ใช้ ชื่อ: <b>{delData.name}</b> หรือไม่</span>
                                    <div className='flex gap-4 justify-end'>
                                        <ButtonPrimary data='ยืนยัน' size='small' className='bg-red-500 hover:bg-red-600' />
                                        <ButtonPrimary onClick={closeModalDel} data='ยกเลิก' size='small' className='bg-gray-500 hover:bg-gray-600' />
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Layout>
    );
};

export default ReportPage;