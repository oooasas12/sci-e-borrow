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
import FilterListBox from '@/components/ListBox/FilterListBox';
import ListBoxComponent from '@/components/ListBox/ListBox';
import { User } from '@/types/user'
import { Branch, Faculty, Group } from '@/types/general';
import DialogInsert from '@/components/dialog/DialogInsert';
import DialogEdit from '@/components/dialog/DialogEdit';
import DialogDel from '@/components/dialog/DialogDel';
import toast, { Toaster } from 'react-hot-toast';

const defaultValueOption = {
    id: 0,
    name: ""
}

const UserPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<User>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<User[]>([
        {
            id: 1, name: 'name 1', username: 'username 1', password: 'password 1', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 2, name: 'name 2', username: 'username 2', password: 'password 2', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 3, name: 'name 3', username: 'username 3', password: 'password 3', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 4, name: 'name 4', username: 'username 4', password: 'password 4', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 5, name: 'name 5', username: 'username 5', password: 'password 5', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 6, name: 'name 6', username: 'username 6', password: 'password 6', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 7, name: 'name 7', username: 'username 7', password: 'password 7', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
        {
            id: 8, name: 'name 8', username: 'username 8', password: 'password 8', fac: {
                id: 1,
                name: "fac 1"
            }, group: {
                id: 1,
                name: "group 1"
            }, branch: {
                id: 1,
                name: "branch 1"
            }
        },
    ]);
    const [filteredData, setFilteredData] = useState<User[]>(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectedFilterGroup, setSelectedFilterGroup] = useState<string[]>([]);
    const [selectedFilterFac, setSelectedFilterFac] = useState<string[]>([]);
    const [selectedFilterBranch, setSelectedFilterBranch] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group>(defaultValueOption);
    const [selectedFac, setSelectedFac] = useState<Faculty>(defaultValueOption);
    const [selectedBranch, setSelectedBranch] = useState<Branch>(defaultValueOption);
    const [errorInput, setErrorInput] = useState({
        fac: false,
        group: false,
        branch: false
    });
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
            results = results.filter(item => selectedFilterGroup.includes(item.group.name.toLowerCase()))
        }
        if (selectedFilterFac.length != 0) {
            results = results.filter(item => selectedFilterFac.includes(item.fac.name.toLowerCase()))
        }
        if (selectedFilterBranch.length != 0) {
            results = results.filter(item => selectedFilterBranch.includes(item.branch.name.toLowerCase()))
        }
        results = results.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.password.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(results);
    }, [searchTerm, selectedFilterGroup, selectedFilterFac, selectedFilterBranch]);

    useEffect(() => {
        reset()
    }, [openInsertData]);

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

    const onSubmit = (data: User) => {
        console.log(data);
        if (!data.branch) {
            setErrorInput({ ...errorInput, branch: true });
            return;
        }
        if (!data.branch) {
            setErrorInput({ ...errorInput, fac: true });
            return;
        }
        if (!data.branch) {
            setErrorInput({ ...errorInput, group: true });
            return;
        }
        setErrorInput({
            branch: false,
            fac: false,
            group: false
        });
        setSelectedGroup(defaultValueOption);
        setSelectedFac(defaultValueOption);
        setSelectedBranch(defaultValueOption);
        setOpenInsertData(false)
        reset()
        console.log(data);
    };

    const handleEdit = (data: User) => {
        console.log("Edit data: ", data);
        setValue('name', data.name)
        setValue('username', data.username)
        setValue('password', data.password)
        setValue('fac', data.fac)
        setValue('branch', data.branch)
        setValue('group', data.group)

        setOpenEditData(true);
        setSelectedBranch(data.branch)
        setSelectedFac(data.fac)
        setSelectedGroup(data.group)
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

    const handleSlectGroup = (value: Group) => {
        setSelectedGroup(value);
        setValue('group', value);

    }

    const handleSlectFac = (value: Faculty) => {
        setSelectedFac(value);
        setValue('fac', value);
    }
    const handleSlectBranch = (value: Branch) => {
        setSelectedBranch(value);
        setValue('branch', value);
    }

    //dialog curd
    const onDel = () => {
        console.log(delData.index);
        setFilteredData((prev) => prev.filter((item) => item.id !== delData.index))
        closeModalDel()
        toast.success('ลบสำเร็จ')
    }

    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
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
                            <FilterListBox placeholder='กลุ่มงาน' selected={selectedFilterGroup} item={group} filter={filterGroup} />
                            <FilterListBox placeholder='ตำแหน่งระดับคณะ' selected={selectedFilterFac} item={fac} filter={filterFac} />
                            <FilterListBox placeholder='ตำแหน่งระดับสาขา' selected={selectedFilterBranch} item={branch} filter={filterBranch} />
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
                                    <TableCell>{item.group.name}</TableCell>
                                    <TableCell>{item.fac.name}</TableCell>
                                    <TableCell>{item.branch.name}</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' size={20} onClick={() => handleEdit(item)} />
                                        <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDel(item.id as number, item.name)} size={20} />
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
            <DialogInsert title='เพิ่มรายการยืม-คืน' onClose={() => setOpenInsertData(false)} open={openInsertData}>
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
                        <ListBoxComponent placeholder='กลุ่มงาน' selectedValue={selectedGroup} options={group} onChange={handleSlectGroup} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="fac" className='text-sm text-font_color'>ตำแหน่งระดับคณะ</label>
                        <ListBoxComponent placeholder='ตำแหน่งระดับคณะ' selectedValue={selectedFac} options={fac} onChange={handleSlectFac} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="branch" className='text-sm text-font_color'>ตำแหน่งระดับสาขา</label>
                        <ListBoxComponent placeholder='ตำแหน่งระดับสาขา' selectedValue={selectedBranch} options={branch} onChange={handleSlectBranch} />
                    </div>
                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogInsert>
            <DialogEdit title='แก้ไขรายการยืม-คืน' onClose={() => setOpenEditData(false)} open={openEditData}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name" className='text-sm text-font_color'>ชื่อ-สกุล</label>
                        <Input
                            type="text"
                            placeholder="ชื่อ-สกุล"
                            {...register('name', { required: 'โปรดกรอกชื่อ-สกุล' })}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="username" className='text-sm text-font_color'>Username</label>
                        <Input
                            type="text"
                            placeholder="username"
                            {...register('username', { required: 'โปรดกรอก Username' })}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name" className='text-sm text-font_color'>Password</label>
                        <Input
                            type="text"
                            placeholder="password"
                            {...register('password', { required: 'โปรดกรอก Password' })}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="group" className='text-sm text-font_color'>กลุ่มงาน / สาขา</label>
                        <ListBoxComponent placeholder='กลุ่มงาน' selectedValue={selectedGroup} options={group} onChange={handleSlectGroup} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="fac" className='text-sm text-font_color'>ตำแหน่งระดับคณะ</label>
                        <ListBoxComponent placeholder='ตำแหน่งระดับคณะ' selectedValue={selectedFac} options={fac} onChange={handleSlectFac} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="branch" className='text-sm text-font_color'>ตำแหน่งระดับสาขา</label>
                        <ListBoxComponent placeholder='ตำแหน่งระดับสาขา' selectedValue={selectedBranch} options={branch} onChange={handleSlectBranch} />
                    </div>
                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogEdit>
            <DialogDel title='ลบรายการยืม-คืน' detail={
                <>
                    คุณต้องการลบรายการยืม-คืน รหัสครุภัณฑ์: <b>{delData.name}</b> หรือไม่
                </>
            } onClose={closeModalDel} open={openDelData} idDel={String(delData.index)} onDel={onDel} />
        </Layout>
    );
};

export default UserPage;