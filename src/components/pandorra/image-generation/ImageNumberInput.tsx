
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export type ImageNumberProps = {
  onChange: (count: number) => void;
};

export const ImageNumberInput = (props: ImageNumberProps) => {
  const handleChange = (count: string) => {
    props.onChange(parseInt(count));
  };
  return (
    <div className='space-y-2'>
      <Label className='mb-2'>Number of Images</Label>
      <Tabs defaultValue='2' className='w-full' onValueChange={handleChange}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='1' className='data-[state=active]:primeBg data-[state=active]:text-white'>
            1
          </TabsTrigger>
          <TabsTrigger value='2' className='data-[state=active]:primeBg data-[state=active]:text-white'>
            2
          </TabsTrigger>
          <TabsTrigger value='3' className='data-[state=active]:primeBg data-[state=active]:text-white'>
            3
          </TabsTrigger>
          <TabsTrigger value='4' className='data-[state=active]:bg-[linear-gradient(122deg, rgb(250, 85, 96) 0.01%, rgb(177, 75, 244) 49.9%, rgb(77, 145, 255) 100%)] data-[state=active]:text-white'>
            4
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
