import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

export function formatDate(date: string | Date): string {
    const notificationDate = dayjs(date);
    const now = dayjs();
    const differenceInWeeks = now.diff(notificationDate, 'week');
    const differenceInYears = now.diff(notificationDate, 'year');

    if (differenceInYears >= 1) {
        return notificationDate.format('MMM YYYY');
    } else if (differenceInWeeks >= 3) {
        return notificationDate.format('DD MMM');
    } else {
        return notificationDate.fromNow(true);
    }
}
