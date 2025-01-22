import { AccountSecurityForm } from '@/components/settings/profile/account-security-form';
import { PersonalInfoForm } from '@/components/settings/profile/personal-info-form';
import { PreferencesForm } from '@/components/settings/profile/preference-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tremor/ui/tabs';

export default function Page() {
  return (
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
  )
}
