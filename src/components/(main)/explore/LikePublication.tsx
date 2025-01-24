'use client';

import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';

import { createPubReaction, deletePubReaction } from '@/actions/publication.action';
import { Button } from '@/components/ui/button';

interface LikePubProps {
  pubIsLiked: boolean;
  pubLikeCount: number;
  publicationId: string;
}

export const LikePublication = (props: LikePubProps) => {
  const [isLiked, setIsLiked] = useState(props.pubIsLiked);
  const [likeCount, setLikeCount] = useState<number>(props.pubLikeCount);
  const { mutate } = useSWRConfig();

  console.log(likeCount);

  const handleReaction = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
      await deletePubReaction(props.publicationId);
      mutate('/api/publication/all');
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      await createPubReaction(props.publicationId);
      mutate('/api/publication/all');
    }
  };

  useEffect(() => {}, [likeCount, isLiked]);

  return (
    <Button size={'sm'} className='h-8 w-full flex gap-2 justify-center items-center' onClick={handleReaction}>
      <span className={`ml-1 text-base ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}>{likeCount}</span>
      <Heart strokeWidth={2.25} className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
    </Button>
  );
};
