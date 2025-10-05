
'use server';

import { clearSession as clearAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function handleLogout() {
  await clearAuthSession();
  redirect('/');
}
