import * as React from "react"
import {GalleryVerticalEnd} from "lucide-react"
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {Button} from "@/components/ui/button";

const data = {
    navMain: [
        {
            title: "Panel Główny",
            url: "/dashboard",
            items: [
                {
                    title: "Frachty",
                    url: "/dashboard/freight",
                    items: [
                        {
                            title: "Dodaj Fracht",
                            url: "/dashboard/freight/create"
                        },

                    ]
                },
                {
                    title: "Oferty",
                    url: "/dashboard/offer",
                },
            ],
        }


    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">VOFFER</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>


                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} className="font-medium">
                                        {item.title}
                                    </Link>

                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                                        {item.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={item.url}>{item.title}</Link>
                                                </SidebarMenuSubButton>
                                                {item.items?.length ? (
                                                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                                                        {item.items.map((item) => (
                                                            <SidebarMenuSubItem key={item.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link href={item.url}>{item.title}</Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                ) : null}

                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>

                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    <div className="pt-16">
                        <Button className="cursor-pointer w-full">
                            <LogoutLink>Wyloguj</LogoutLink>
                        </Button>
                    </div>

                </SidebarGroup>

            </SidebarContent>

        </Sidebar>
    )
}
