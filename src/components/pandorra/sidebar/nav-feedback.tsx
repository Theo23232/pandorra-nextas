'use client';

import { Loader2, Send, Star } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { createFeedback } from '@/actions/feedback.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';

const feedbackSchema = z.object({
  feedbackType: z.enum(['bug', 'feature', 'improvement', 'other'], {
    required_error: 'Please select a feedback type.',
  }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  rating: z.number().min(1).max(5),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export function FeedbackDialog({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackType: 'improvement',
      message: '',
      rating: 3,
    },
  });

  async function onSubmit(data: FeedbackForm) {
    setIsSubmitting(true);
    await createFeedback(data.feedbackType, data.message, data.rating);
    setIsSubmitting(false);
    console.log(data);
    toast('Thank you for your feedback! We appreciate your input.');
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>We value your input. Please share your thoughts with us to help improve our service.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='feedbackType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='bug' />
                        </FormControl>
                        <FormLabel className='font-normal'>Bug Report</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='feature' />
                        </FormControl>
                        <FormLabel className='font-normal'>Feature Request</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='improvement' />
                        </FormControl>
                        <FormLabel className='font-normal'>Improvement</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='other' />
                        </FormControl>
                        <FormLabel className='font-normal'>Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Please share your thoughts here...' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate your experience</FormLabel>
                  <FormControl>
                    <div className='flex space-x-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-6 w-6 cursor-pointer ${star <= field.value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} onClick={() => field.onChange(star)} />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>Click on a star to rate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Submitting
                  </>
                ) : (
                  <>
                    <Send className='mr-2 h-4 w-4' />
                    Submit Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
