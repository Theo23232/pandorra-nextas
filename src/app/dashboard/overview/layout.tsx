import { currentUser } from '@/lib/current-user';

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser()
  console.log("user ===> ", user)
  return (
    <div className="relative">
      <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
        {children}
      </div>
    </div>
  )
}
