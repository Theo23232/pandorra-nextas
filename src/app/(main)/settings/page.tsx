import { AccountSecurityForm } from "@/components/settings/profile/account-security-form"
import { PersonalInfoForm } from "@/components/settings/profile/personal-info-form"
import { PreferencesForm } from "@/components/settings/profile/preference-form"
import { SettingSidebar } from "@/components/settings/settings-sidebar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tremor/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <SettingSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Tabs defaultValue="personalInfo" className="max-w-2xl">
            <TabsList>
              <TabsTrigger value="personalInfo">Personal info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <div className="ml-2 mt-4">
              <TabsContent
                value="personalInfo"
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >
                <PersonalInfoForm />
              </TabsContent>
              <TabsContent
                value="security"
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >
                <AccountSecurityForm />
              </TabsContent>
              <TabsContent
                value="preferences"
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >
                <PreferencesForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
