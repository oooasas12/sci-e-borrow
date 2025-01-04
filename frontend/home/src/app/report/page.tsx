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
    equipment: String,
    borrowing_date: String
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
        { id: 1, id_equipment: '1-asws', equipment: 'Laptop', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 2, id_equipment: '2-asws', equipment: 'Laptop', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 3, id_equipment: '3-asws', equipment: 'test 3', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 4, id_equipment: '5-asws', equipment: 'test 4', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 5, id_equipment: '4-asws', equipment: 'test 5', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 6, id_equipment: '6-asws', equipment: 'test 6', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 7, id_equipment: '7-asws', equipment: 'test 7', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 8, id_equipment: '8-asws', equipment: 'test 8', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        // Add more data as needed
    ]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectGroup, setSelectGroup] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [errorInput, setErrorInput] = useState(false);
    const [editData, setEditData] = useState<Inputs>();
    const [delData, setDelData] = useState({
        index: 0,
        id_equipment: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const [group, setGroup] = useState([
        { id: '1', name: 'test group 1' },
        { id: '2', name: 'test group 2' }
    ]);


    const equipment = [
        { id: 1, name: 'Laptop' },
        { id: 2, name: 'Projector' },
        { id: 3, name: 'Microphone' },
    ];

    useEffect(() => {
        let results = data
        if (selectGroup.length != 0) {
            results = results.filter(item => selectGroup.includes(item.group.toLowerCase()))
        }
        results = results.filter(item => item.equipment.toLowerCase().includes(searchTerm.toLowerCase()))
        setFilteredData(results);
    }, [searchTerm, selectGroup]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterGroup = (value: string) => {
        if (value === 'all') {
            setSelectGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectGroup.includes(value)) {
            setSelectGroup(selectGroup.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectGroup([...selectGroup, value]);
        }
    }

    const onSubmit = (data: Inputs) => {
        setSelectedEquipment('');
        if (data.equipment) {
            console.log("data: ", data);
            setErrorInput(false);
        }
        console.log(data);
    };

    const handleEdit = (data: any) => {
        console.log("Edit data: ", data);
        setEditData(data);
        setOpenEditData(true);
    }

    const handleDel = (index: number, id_equipment: string) => {
        console.log("del index: ", index);
        setDelData({
            index: index,
            id_equipment: id_equipment
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
                <h1 className='title lg text-font_color'>รายงานการยืม-คืน</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Input
                                type="text"
                                placeholder="Search reports..."
                                className='w-[300px] bg-white'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Listbox value={selectGroup}>
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm'>สถานะ</span>
                                        {selectGroup.length != 0 && (
                                            <div className='flex gap-1 items-center border-l-2 pl-3'>
                                                {selectGroup.length > 2 ? (
                                                    <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded' >3 ตัวเลือกขึ้นไป</div>
                                                ) : (
                                                    selectGroup.map((item, index) => (
                                                        <div className='px-1 text-sm text-gray-500 bg-gray-300 rounded' key={index}>{item}</div>
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
                                                {selectGroup.length == 0 && (
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
                                                    {selectGroup.includes(item.name) && (
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
                            <button onClick={() => setOpenInsertData(true)} className='bg-primary_1 hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>เพิ่มรายการ</span>
                            </button>
                        </div>
                    </div>
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className=' whitespace-nowrap'>#</TableHead>
                                <TableHead className=' whitespace-nowrap'>รหัสครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>ชื่ออุปกรณ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>กลุ่มครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่ยืม</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่คืน</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานที่ตั้ง/จัดเก็บ</TableHead>
                                <TableHead className=' whitespace-nowrap'>เอกสารการยืม</TableHead>
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.slice(
                                currentPage * perPage - perPage,
                                currentPage * perPage
                            ).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{item.id_equipment}</TableCell>
                                    <TableCell>{item.equipment}</TableCell>
                                    <TableCell>{item.group}</TableCell>
                                    <TableCell>{item.borrowing_date}</TableCell>
                                    <TableCell>{item.return_date}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' size={20} onClick={() => handleEdit(item)} />
                                        <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDel(item.id, item.id_equipment)} size={20} />
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
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:mt-[100px] text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        เพิ่มรายการยืม-คืน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                                        <Listbox value={selectedEquipment}
                                            onChange={(value) => {
                                                setSelectedEquipment(value);
                                                setValue('equipment', value); // Update useForm state
                                            }}>
                                            <div className="relative z-10 my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{selectedEquipment || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {equipment.map((item, index) => (
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
                                                                {selectedEquipment === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกครุภัณฑ์</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                                        <Input type="date" id='borrowing_date' defaultValue={new Date().toISOString().split('T')[0]} className='w-full' {...register('borrowing_date', { required: 'โปรดเลือกวันที่ยืม' })} />
                                        {errors.borrowing_date && (
                                            <span className="text-red-500 text-sm">{errors.borrowing_date.message}</span>
                                        )}
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
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:mt-[100px] text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        แก้ไขรายการยืม-คืน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenEditData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                                        <Listbox value={selectedEquipment}
                                            onChange={(value) => {
                                                setSelectedEquipment(value);
                                                setValue('equipment', value); // Update useForm state
                                            }}
                                        >
                                            <div className="relative z-10 my-scroll">
                                                <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-start gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                                    <span className='text-sm'>{editData?.equipment || 'เลือกครุภัณฑ์'}</span>
                                                </ListboxButton>
                                                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {equipment.map((item, index) => (
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
                                                                {editData?.equipment === item.name && <FaCheck className='ml-auto' />}
                                                            </div>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                                {errorInput && (
                                                    <span className="text-red-500 text-sm">โปรดเลือกครุภัณฑ์</span>
                                                )}
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                                        <Input type="date" id='borrowing_date' defaultValue={new Date().toISOString().split('T')[0]} className='w-full' {...register('borrowing_date', { required: 'โปรดเลือกวันที่ยืม' })} />
                                        {errors.borrowing_date && (
                                            <span className="text-red-500 text-sm">{errors.borrowing_date.message}</span>
                                        )}
                                    </div>
                                    <ButtonPrimary data='ยืนยัน' type='submit' size='small' className='ml-auto' />
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
                                        ลบรายการยืม-คืน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenDelData(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-font_color'>คุณต้องการลบรายการยืม-คืน รหัสครุภัณฑ์: <b>{delData.id_equipment}</b> หรือไม่</span>
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