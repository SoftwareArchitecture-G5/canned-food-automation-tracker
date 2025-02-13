import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/header-footer/ThemeToggle";
import Link from "next/link";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton, SignUpButton,
} from '@clerk/nextjs'
import {MonitorCog} from "lucide-react";

export const Navbar = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 shadow-md px-32">
            <div className="flex font-bold text-2xl items-center gap-4">
                <MonitorCog/>
            <Link href="/" className="">Automation Tracker</Link>
            </div>
            <div className="flex flex-col sm:flex-row space-x-4 items-center">
                <Link href="/" className="">Home</Link>
                <Link href="/automations" className="">Automation</Link>
                <Link href="/dashboard" className="">Dashboard</Link>
                <Link href="/blueprint" className="">Blueprint</Link>
                <Link href="/calendar" className="">Calendar</Link>
                <SignedOut>
                    <Button asChild variant="outline">
                        <SignInButton/>
                    </Button>
                    <Button asChild>
                        <SignUpButton/>
                    </Button>
                </SignedOut>
                <SignedIn>
                        <UserButton/>
                </SignedIn>
                <ModeToggle />
            </div>
        </div>
    );
};
