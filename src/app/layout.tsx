import Link from 'next/link';
import './globals.css';
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'SmartHome IOT',
    description: 'Dasboard login/register',
}

export default function RootLayout({
    children,
}:{
    children: React.ReactNode
}){
    return (
        <html lang="en">
            <body>
                <header className='bg-white shadow p-4 flex justify-between items-center'>
                    <h1 className='text-xl1 font-bold'>Smarthome-iot</h1>
                    <nav className='space-x-4'>
                        <Link href='/'>Beranda</Link>
                        <Link href='/tentang'>Tentang</Link>
                        <Link href='/login'>Login</Link>
                        <Link href='/daftar'>Daftar</Link>
                        <Link href='/admin' className='text-sm text-gray-500'>Admin</Link>
                    </nav>
                </header>
                <main className=' min-h-screen  p-6  bg-gray-50'>{children}</main>
                <footer className='bg-white text-center text-sm '>
                    &copy;{new Date().getFullYear()} smarthome-iot. All Right reserved.
                </footer>
               
            </body>
        </html>
    );
}