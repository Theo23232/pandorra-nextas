/* eslint-disable jsx-a11y/alt-text */
"user client"
import { Image, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PublicationTabsProps {
  onChange: (active: string) => void
}

export const PublicationTabs = (props: PublicationTabsProps) => {
  const { t } = useTranslation()
  const handleChange = (active: string) => {
    props.onChange(active)
  }
  return (
    <div className="mb-8">
      <Tabs defaultValue="image" className="" onValueChange={handleChange}>
        <TabsList className="w-[300px]">
          <TabsTrigger
            value="image"
            className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Image size={17} />
            {t(`Image`)}
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Video size={19} />
            {t(`Video`)}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
