'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold">Strona nie została znaleziona</h2>
                <p className="text-muted-foreground">
                    Przepraszamy, ale strona której szukasz nie istnieje lub nie masz do niej dostępu.
                </p>
                <Button 
                    onClick={() => router.push('/dashboard')}
                    className="mt-4"
                >
                    Wróć do panelu głównego
                </Button>
            </div>
        </div>
    );
} 