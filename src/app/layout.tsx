

import './globals.css';
import { Metadata } from "next";
import NavbarUtama from '@/componentsnavbarUtama/page';



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
                <NavbarUtama/>
                <main className=' min-h-screen  p-6  bg-gray-50'>
                    {children}</main>
                <footer className='bg-white text-center text-sm '>
                    &copy;{new Date().getFullYear()} smarthome-iot. All Right reserved.
                </footer>
               
            </body>
        </html>
    );
}