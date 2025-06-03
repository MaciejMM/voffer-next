"use server"

import { db } from "@/lib/db";
import { freights } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { Freight } from "@/ui/freight/freight-table/columns";

interface TransEuResponse {
    id: string;
    status: string;
    // Add other fields as needed
}

export async function createFreight(rawFormData: any, transEuResponse: TransEuResponse | null = null) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Store both the form data and TRANS.EU response
    const [freight] = await db.insert(freights).values({
        transeuId: transEuResponse?.id || null,
        rawFormData: {
            ...rawFormData,
            transEuResponse: transEuResponse || null
        },
        userId: user.id,
    }).returning();

    return freight;
}

export async function getFreights(): Promise<Freight[]> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
        throw new Error("Unauthorized");
    }

    const result = await db.select().from(freights).where(eq(freights.userId, user.id));
    return result.map(freight => ({
        ...freight,
        rawFormData: freight.rawFormData as Freight['rawFormData']
    }));
}

export async function getFreightById(id: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const [freight] = await db.select().from(freights).where(eq(freights.id, id));
    if (!freight || freight.userId !== user.id) throw new Error("Freight not found");

    return freight;
}

export async function updateFreight(id: string, rawFormData: any, transEuResponse: TransEuResponse | null = null) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const [freight] = await db.select().from(freights).where(eq(freights.id, id));
    if (!freight || freight.userId !== user.id) throw new Error("Freight not found");

    // Update both the form data and TRANS.EU response
    const [updatedFreight] = await db.update(freights)
        .set({
            transeuId: transEuResponse?.id || null,
            rawFormData: {
                ...rawFormData,
                transEuResponse: transEuResponse || null
            },
            updatedAt: new Date(),
        })
        .where(eq(freights.id, id))
        .returning();

    return updatedFreight;
}

export async function deleteFreight(id: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const [freight] = await db.select().from(freights).where(eq(freights.id, id));
    if (!freight || freight.userId !== user.id) throw new Error("Freight not found");

    await db.delete(freights).where(eq(freights.id, id));
    return { success: true };
}

export async function updateFreightPublishState(id: string, isPublished: boolean) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const [freight] = await db.select().from(freights).where(eq(freights.id, id));
    if (!freight || freight.userId !== user.id) throw new Error("Freight not found");

    const [updatedFreight] = await db.update(freights)
        .set({
            isPublished,
            updatedAt: new Date(),
        })
        .where(eq(freights.id, id))
        .returning();

    return updatedFreight;
} 