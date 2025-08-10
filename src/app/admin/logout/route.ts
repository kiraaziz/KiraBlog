import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function POST() {
    (cookies() as any).delete('admin_auth')
    redirect('/')
}