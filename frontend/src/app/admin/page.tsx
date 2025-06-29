'use client';

import { redirect } from 'next/navigation';

export default function Dashboard() {
    redirect('/admin/overview');
    return null;
}
