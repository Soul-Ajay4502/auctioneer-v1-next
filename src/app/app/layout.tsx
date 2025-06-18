import ClientLayout from '@/app/app/dashboard-client-layout'
import { cookies } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

    return <ClientLayout defaultOpen={defaultOpen}>{children}</ClientLayout>
}
