import Image from "next/image";
export default function Navbar(){
    return(
        <nav className="w-full flex-items-center justify-between p-6 bg-cream border-b border-gray-200">
            <div className="flex items-center">
                <Image
                src="/logo.png"
                alt="Klyrr Logo"
                width={120}
                height={40}
                className="object-contain h-8 w-auto"
                priority
                />
            </div>
        </nav>
    );
}