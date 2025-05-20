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
            <body className="bg-blue-500 text-gray-800">
                {children}
            </body>
        </html>
    );
}