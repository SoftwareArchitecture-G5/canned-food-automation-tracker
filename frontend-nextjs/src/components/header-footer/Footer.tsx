import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mx-32">
                    <p className="text-xs text-muted-foreground">© 2024 Our Canned Food Company. Internal use only.</p>
                    <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                        <Link className="text-xs hover:underline underline-offset-4" href="#">
                            IT Support
                        </Link>
                        <Link className="text-xs hover:underline underline-offset-4" href="#">
                            User Manual
                        </Link>
                        <Link className="text-xs hover:underline underline-offset-4" href="#">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

