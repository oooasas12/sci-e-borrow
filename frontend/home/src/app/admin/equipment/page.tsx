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
import { IoIosArrowDown } from 'react-icons/io';
import ListBoxComponent from '@/components/ListBox/ListBox';

type Inputs = {
    name: String,
    username: String,
    password: String,
    fac: String,
    group: String,
    branch: String
}

const EquipmentPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([
        { id: 1, id_equipment: 'equipment 1', value: '2000', date_come: '2024-12-05', source_money: 'test 1', property: 'property 1', where_save: 'save 1', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 1', equipment_type: 'equipment_type 1', equipment_name: 'name 1', note: 'หมายเหตุ 1' },
        { id: 2, id_equipment: 'equipment 2', value: '2000', date_come: '2024-12-05', source_money: 'test 2', property: 'property 2', where_save: 'save 2', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 2', equipment_type: 'equipment_type 2', equipment_name: 'name 2', note: 'หมายเหตุ 2' },
        { id: 3, id_equipment: 'equipment 3', value: '2000', date_come: '2024-12-05', source_money: 'test 3', property: 'property 3', where_save: 'save 3', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 3', equipment_type: 'equipment_type 3', equipment_name: 'name 3', note: 'หมายเหตุ 3' },
        { id: 4, id_equipment: 'equipment 4', value: '2000', date_come: '2024-12-05', source_money: 'test 4', property: 'property 4', where_save: 'save 4', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 4', equipment_type: 'equipment_type 4', equipment_name: 'name 4', note: 'หมายเหตุ 4' },
        { id: 5, id_equipment: 'equipment 5', value: '2000', date_come: '2024-12-05', source_money: 'test 5', property: 'property 5', where_save: 'save 5', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 5', equipment_type: 'equipment_type 5', equipment_name: 'name 5', note: 'หมายเหตุ 5' },
        { id: 6, id_equipment: 'equipment 6', value: '2000', date_come: '2024-12-05', source_money: 'test 6', property: 'property 6', where_save: 'save 6', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 6', equipment_type: 'equipment_type 6', equipment_name: 'name 6', note: 'หมายเหตุ 6' },
        { id: 7, id_equipment: 'equipment 7', value: '2000', date_come: '2024-12-05', source_money: 'test 7', property: 'property 7', where_save: 'save 7', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 7', equipment_type: 'equipment_type 7', equipment_name: 'name 7', note: 'หมายเหตุ 7' },
        { id: 8, id_equipment: 'equipment 8', value: '2000', date_come: '2024-12-05', source_money: 'test 8', property: 'property 8', where_save: 'save 8', status_equipment: 'ปกติ', status_bow: 'ยืม', counting_unit: 'อัน', geoup: 'group 8', equipment_type: 'equipment_type 8', equipment_name: 'name 8', note: 'หมายเหตุ 8' },
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

    const onSubmit = (data: Inputs) => {
        console.log(data);
    };

    const perPageSelectorHandler = (perPage: number) => {
    }

    const pageDirectHandler = (index: number) => {
    }
    const handleDel = (index: number, name: string) => {
        setDelData({
            index: index,
            name: name
        });
        setOpenDelData(true);
    }
    return (
        <Layout>
            <div className='container'>
                <h1 className='title lg text-font_color'>รายการครุภัณฑ์</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2 '>
                            <Input
                                type="text"
                                placeholder="ค้นหา..."
                                className='min-w-[250px] w-[300px] bg-white'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Listbox >
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap flex items-center justify-between gap-4'>กลุ่มงาน / สาขา<IoIosArrowDown /></span>
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
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterGroup.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            <Listbox >
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap flex items-center justify-between gap-4'>สถานะครุภัณฑ์<IoIosArrowDown /></span>
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
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterFac.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            <Listbox >
                                <div className="relative z-10 my-scroll">
                                    <ListboxButton className="w-full px-2 h-9  py-1 flex items-center  justify-center gap-3  rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className='text-sm whitespace-nowrap flex items-center justify-between gap-4'>ประเภทครุภัณฑ์<IoIosArrowDown /></span>
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
                                        >
                                            ทั้งหมด
                                            <div className='w-[10%]'>
                                                {selectedFilterBranch.length == 0 && (
                                                    <FaCheck />
                                                )}
                                            </div>
                                        </ListboxOption>
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
                                <TableHead className=' whitespace-nowrap'>รหัสครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>รายการครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>กลุ่มงาน / สาขา</TableHead>
                                <TableHead className=' whitespace-nowrap'>ประเภทครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานะครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานะการยืม-คืน</TableHead>
                                <TableHead className=' whitespace-nowrap'>หน่วยนับ</TableHead>
                                <TableHead className=' whitespace-nowrap'>มูลค่าครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่ได้มา</TableHead>
                                <TableHead className=' whitespace-nowrap'>แหล่งเงิน</TableHead>
                                <TableHead className=' whitespace-nowrap'>คุณสมบัติ (ยี่ห่อ/รุ่น)</TableHead>
                                <TableHead className=' whitespace-nowrap'>หมายเหตุ/เลขครุภัณฑ์เดิม</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานที่ตั้ง/จัดเก็บ</TableHead>
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
                                    <TableCell>{item.id_equipment}</TableCell>
                                    <TableCell>{item.equipment_name}</TableCell>
                                    <TableCell>{item.geoup}</TableCell>
                                    <TableCell>{item.equipment_type}</TableCell>
                                    <TableCell>{item.status_equipment}</TableCell>
                                    <TableCell>{item.status_bow}</TableCell>
                                    <TableCell>{item.counting_unit}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell>{item.date_come}</TableCell>
                                    <TableCell>{item.source_money}</TableCell>
                                    <TableCell>{item.property}</TableCell>
                                    <TableCell>{item.note}</TableCell>
                                    <TableCell>{item.where_save}</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' onClick={() => setOpenEditData(true)} size={20} />
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
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        เพิ่มรายการครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>รหัสครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="รหัสครุภัณฑ์"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>ชื่อครุภัณฑ์</label>
                                        <ListBoxComponent name='ชื่อครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>มูลค่าครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="มูลค่าครุภัณฑ์"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>วันที่ได้มา</label>
                                        <Input
                                            type="date"
                                            placeholder="วันที่ได้มา"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>คุณสมบัติ (ยี่ห่อ/รุ่น)</label>
                                        <Input
                                            type="text"
                                            placeholder="คุณสมบัติ (ยี่ห่อ/รุ่น)"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>หมายเหตุ/เลขครุภัณฑ์เดิม</label>
                                        <Input
                                            type="text"
                                            placeholder="หมายเหตุ/เลขครุภัณฑ์เดิม"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>สถานที่ตั้ง/จัดเก็บ</label>
                                        <Input
                                            type="text"
                                            placeholder="สถานที่ตั้ง/จัดเก็บ"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>สถานะครุภัณฑ์</label>
                                        <ListBoxComponent name='สถานะครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>สถานะยืมคืน</label>
                                        <ListBoxComponent name='สถานะยืมคืน' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>แหล่งเงิน</label>
                                        <ListBoxComponent name='แหล่งเงิน' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>หน่วยนับ</label>
                                        <ListBoxComponent name='หน่วยนับ' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มงาน / สาขา</label>
                                        <ListBoxComponent name='กลุ่มงาน / สาขา' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มครุภัณฑ์</label>
                                        <ListBoxComponent name='กลุ่มครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>รายการชื่อครุภัณฑ์</label>
                                        <ListBoxComponent name='รายการชื่อครุภัณฑ์' />
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
                                        แก้ไขรายการครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenEditData(false)} />
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>รหัสครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="รหัสครุภัณฑ์"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>ชื่อครุภัณฑ์</label>
                                        <ListBoxComponent name='ชื่อครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>มูลค่าครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="มูลค่าครุภัณฑ์"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>วันที่ได้มา</label>
                                        <Input
                                            type="date"
                                            placeholder="วันที่ได้มา"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>คุณสมบัติ (ยี่ห่อ/รุ่น)</label>
                                        <Input
                                            type="text"
                                            placeholder="คุณสมบัติ (ยี่ห่อ/รุ่น)"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>หมายเหตุ/เลขครุภัณฑ์เดิม</label>
                                        <Input
                                            type="text"
                                            placeholder="หมายเหตุ/เลขครุภัณฑ์เดิม"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>สถานที่ตั้ง/จัดเก็บ</label>
                                        <Input
                                            type="text"
                                            placeholder="สถานที่ตั้ง/จัดเก็บ"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>สถานะครุภัณฑ์</label>
                                        <ListBoxComponent name='สถานะครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>สถานะยืมคืน</label>
                                        <ListBoxComponent name='สถานะยืมคืน' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>แหล่งเงิน</label>
                                        <ListBoxComponent name='แหล่งเงิน' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>หน่วยนับ</label>
                                        <ListBoxComponent name='หน่วยนับ' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มงาน / สาขา</label>
                                        <ListBoxComponent name='กลุ่มงาน / สาขา' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มครุภัณฑ์</label>
                                        <ListBoxComponent name='กลุ่มครุภัณฑ์' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="group" className='text-sm text-font_color'>รายการชื่อครุภัณฑ์</label>
                                        <ListBoxComponent name='รายการชื่อครุภัณฑ์' />
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
                                        ลบรายการครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenDelData(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-font_color'>คุณต้องการลบรายการครุภัณฑ์ ชื่อ: <b>{delData.name}</b> หรือไม่</span>
                                    <div className='flex gap-4 justify-end'>
                                        <ButtonPrimary data='ยืนยัน' size='small' className='bg-red-500 hover:bg-red-600' />
                                        <ButtonPrimary  data='ยกเลิก' size='small' className='bg-gray-500 hover:bg-gray-600' />
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

export default EquipmentPage;