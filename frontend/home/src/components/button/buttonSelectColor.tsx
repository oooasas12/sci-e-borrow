"use client";

import React from "react";
import { useRouter } from 'next/navigation'

type ButtonData = {
    icon?: React.ReactNode; // รองรับ JSX สำหรับ Icon
    data: string; // ข้อความบนปุ่ม
    onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
    href?: string; // ใช้สำหรับ Link
    className?: string; // รองรับคลาสเพิ่มเติม
    size: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit';
};

export const ButtonSelectColor = ({
    icon,
    data,
    onClick,
    href,
    className,
    size = 'medium',
    type = 'button'
}: ButtonData) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            router.push(href);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={` rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all 
                ${className} 
                ${size == 'large' ? 'min-h-14' : size == 'medium' ? 'min-h-12' : 'min-h-10' }
            `}
            type={type}
        >
            {icon && <span>{icon}</span>}
            <span>{data}</span>
        </button>
    );
};

export default ButtonSelectColor;
