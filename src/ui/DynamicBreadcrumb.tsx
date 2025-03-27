"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function DynamicBreadcrumb() {
    const pathname = usePathname();

    const pathSegments = pathname.split("/").filter(segment => segment !== "");

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <span key={href} className="flex items-center">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{decodeURIComponent(segment)}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
