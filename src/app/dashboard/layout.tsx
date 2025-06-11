import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@radix-ui/react-separator";
import DynamicBreadcrumb from "@/ui/DynamicBreadcrumb";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
        >
            <AppSidebar/>
            <SidebarInset>
                <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <DynamicBreadcrumb/>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 w-full">
                    <div className="rounded-lg ">{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
