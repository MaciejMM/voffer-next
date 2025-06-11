"use server"

import { db } from "@/lib/db";
import { freights } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { Freight } from "@/ui/freight/freight-table/columns";
import {  getTransEuFreightStatuses } from '../transEuApi';

interface TransEuResponse {
    id: string;
    status: string;
    // Add other fields as needed
}

interface TransEuStatus {
    id: string;
    status: string;
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
    
    // Get all transeuIds from the result
    const transeuIds = result
        .filter(freight => freight.transeuId)
        .map(freight => freight.transeuId as string);

    // Fetch Trans.eu statuses
    const transEuStatuses = await getTransEuFreightStatuses(transeuIds);
    // Create a map of transeuId to status for quick lookup
    const statusMap = new Map(
        transEuStatuses.map((status: TransEuStatus) => [status.id, status.status])
    );

    // Map the results and include Trans.eu status
    return result.map(freight => {
        const transEuStatus = freight.transeuId ? statusMap.get(freight.transeuId) ?? null : null;
        
        const freightData: Freight = {
            id: freight.id,
            transeuId: freight.transeuId,
            transEuStatus,
            rawFormData: freight.rawFormData as Freight['rawFormData'],
            userId: freight.userId,
            isActive: freight.isActive,
            createdAt: freight.createdAt,
            updatedAt: freight.updatedAt
        };
        
        return freightData;
    });
}

export async function getFreightById(id: string): Promise<Freight> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
        throw new Error("Unauthorized");
    }

    const freight = await db.query.freights.findFirst({
        where: eq(freights.id, id),
    });

    if (!freight || freight.userId !== user.id) throw new Error("Freight not found");

    // Get Trans.eu status if transeuId exists
    let transEuStatus = null;
    if (freight.transeuId) {
        const statuses = await getTransEuFreightStatuses([freight.transeuId]);
        transEuStatus = statuses[0]?.status ?? null;
    }

    return {
        ...freight,
        transEuStatus
    } as Freight;
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