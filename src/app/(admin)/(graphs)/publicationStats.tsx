'use client';

import { ArrowDownIcon, ArrowUpIcon, FileText, MessageSquare, MinusIcon, ThumbsUp, Users } from 'lucide-react';
import useSWR from 'swr';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetcher } from '@/lib/utils';

type APIResponse = {
  publications: {
    total: number;
    weekly: number;
    percentage: string;
  };
  comments: {
    total: number;
    weekly: number;
    percentage: string;
  };
  reactions: {
    total: number;
    weekly: number;
    percentage: string;
  };
  users: {
    total: number;
    weekly: number;
    percentage: string;
  };
  follows: {
    total: number;
    weekly: number;
    percentage: string;
  };
};

const StatCard = ({ title, data, icon: Icon }: { title: string; data: { total: number; weekly: number; percentage: string }; icon: React.ElementType }) => {
  const trendPercentage = parseFloat(data.percentage);
  let TrendIcon = MinusIcon;
  let trendColor = 'text-yellow-600';

  if (trendPercentage > 0) {
    TrendIcon = ArrowUpIcon;
    trendColor = 'text-green-600';
  } else if (trendPercentage < 0) {
    TrendIcon = ArrowDownIcon;
    trendColor = 'text-red-600';
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{data.total.toLocaleString()}</div>
        <p className='text-xs text-muted-foreground'>{data.weekly.toLocaleString()} this week</p>
        <div className='mt-4 flex items-center space-x-2'>
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>{data.percentage}</span>
          <span className='text-sm text-muted-foreground'>from last week</span>
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonCard = () => <Skeleton className='h-[162px] w-full' />;

export function StatsWithTrends() {
  const { data, error } = useSWR<APIResponse>('/api/administration/stats', fetcher);

  if (error) {
    return <div className='text-red-500'>Failed to load statistics</div>;
  }

  if (!data) {
    return (
      <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-5'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-5'>
      <StatCard title='Publications' data={data.publications} icon={FileText} />
      <StatCard title='Comments' data={data.comments} icon={MessageSquare} />
      <StatCard title='Reactions' data={data.reactions} icon={ThumbsUp} />
      <StatCard title='Users' data={data.users} icon={Users} />
      <StatCard title='follows' data={data.follows} icon={MessageSquare} />
    </div>
  );
}
