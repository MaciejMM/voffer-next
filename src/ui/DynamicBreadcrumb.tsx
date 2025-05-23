"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";

const translations: Record<string, string> = {
    dashboard: "Panel",
    freight: "Frachty",
    create: "Utwórz",
    edit: "Edytuj",
    settings: "Ustawienia",
    profile: "Profil",
    "new-freight": "Nowy Fracht",
    "edit-freight": "Edytuj Fracht"
};

export default function DynamicBreadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(segment => segment !== "" && !Number(segment));

    const translateSegment = (segment: string) => {
        return translations[segment] || segment;
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;
                    const translatedSegment = translateSegment(decodeURIComponent(segment));
                    return (
                        <span key={href} className="flex items-center">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{translatedSegment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{translatedSegment}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
