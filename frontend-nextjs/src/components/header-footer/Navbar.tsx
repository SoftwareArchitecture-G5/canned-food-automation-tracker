import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/header-footer/ThemeToggle";
import Link from "next/link";

export const Navbar = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 shadow-md px-32">
            <div className="font-bold text-2xl ">
            <Link href="/" className="">Automation Tracker</Link>
            </div>
            <div className="flex flex-col sm:flex-row space-x-4 items-center">
                <Link href="/" className="">Home</Link>
                <Link href="/automations" className="">Automation</Link>
                <Link href="/dashboard" className="">Dashboard</Link>
                <Link href="/blueprint" className="">Blueprint</Link>
                <Link href="/calendar" className="">Calendar</Link>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
                <ModeToggle />
            </div>
        </div>
    );
};
