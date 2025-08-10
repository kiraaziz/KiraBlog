import RootLayout from "@/components/ui/MainLayout";
import { db } from "@/server/db";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const settings = await db.setting.findMany({})
  return <RootLayout settings={settings}>
    {children}
  </RootLayout>
}