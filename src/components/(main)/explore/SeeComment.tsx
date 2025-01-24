import Image from 'next/image';
import React, { ReactNode } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface SeeCommentProps {
  children: ReactNode;
}

export default function SeeComment(props: SeeCommentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
