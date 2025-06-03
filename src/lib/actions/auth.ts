'use server';

import { generateTransEuAuthUrl } from '../auth/transEuAuth';
import { redirect } from 'next/navigation';

export async function handleTransEuLogin() {
    const authUrl = await generateTransEuAuthUrl();
    redirect(authUrl);
}
