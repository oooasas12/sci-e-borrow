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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReportPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([
        { id: 1, name: 'test 1', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 2, name: 'test 2', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 3, name: 'test 3', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 4, name: 'test 4', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 5, name: 'test 5', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 6, name: 'test 6', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 7, name: 'test 7', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        { id: 8, name: 'test 8', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group' },
        // Add more data as needed
    ]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);

    const [group, setGroup] = useState([
        { id: '1', name: 'test group 1' },
        { id: '2', name: 'test group 2' }
    ]);

    useEffect(() => {
        const results = data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterGroup = (group: string) => {
        const results = data.filter(item =>
            item.group.toLowerCase().includes(group.toLowerCase())
        );
        setFilteredData(results);
    }

    return (
        <Layout>
            <div className='container'>
                <h1 className='title lg text-font_color'>รายการผู้ใช้</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Input
                                type="text"
                                placeholder="Search reports..."
                                className='w-[300px]'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Select onValueChange={(value) => filterGroup(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="กลุ่มครุภัณฑ์" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {group.map((item, index) => (
                                            <SelectItem key={index} value={item.name}>{item.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.group}</TableCell>
                                    <TableCell>{item.borrowing_date}</TableCell>
                                    <TableCell>{item.return_date}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell className='text-yellow-500'>edit</TableCell>
                                    <TableCell className='text-red-500'>delete</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
};

export default ReportPage;