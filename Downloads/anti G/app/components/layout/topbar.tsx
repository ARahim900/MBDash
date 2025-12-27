"use client"

import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Topbar() {
    return (
        <div className="flex items-center p-4 border-b h-16 bg-background">
            <Sheet>
                <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-slate-900 border-none w-72 text-white">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <Sidebar />
                </SheetContent>
            </Sheet>

            <div className="ml-4 md:ml-0 flex w-full justify-between items-center">
                <h2 className="text-lg font-semibold md:hidden">
                    Muscat Bay Ops
                </h2>
                {/* On desktop, the title is in the sidebar, or we can add breadcrumbs here */}
                <div className="hidden md:block">
                    {/* Breadcrumb or Page Title placeholder */}
                </div>

                <div className="flex items-center gap-x-2 ml-auto">
                    <div className="text-sm text-muted-foreground mr-2 hidden md:block">
                        Admin User
                    </div>
                    <Avatar>
                        <AvatarImage src="/admin-profile.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}
