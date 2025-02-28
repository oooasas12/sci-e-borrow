import { NextResponse } from 'next/server';
import { store } from '@/store/store'; // สมมุติว่ามีฟังก์ชันนี้เพื่อดึง store

export async function middleware(req: Request) {
    const state = store.getState();
    const user = state.auth.user;

    if (!user) {
        return NextResponse.redirect('/login');
    }

    return NextResponse.next();
}
