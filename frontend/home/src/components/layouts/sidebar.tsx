"use client";

import React from "react";
import { useRouter } from 'next/navigation'

type SidebarData = {
};

export const Sidebar = () => {
    const router = useRouter();

    return (
        <div className="bg-primary_1 fixed top-0 left-0 h-screen w-64">
            
        </div>
    );
};

export default Sidebar;
