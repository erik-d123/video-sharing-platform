import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    // Handle ISO string dates
    let date = new Date(dateString);
    
    // If the date is invalid, try parsing it as an ISO string
    if (!isValid(date)) {
      date = parseISO(dateString);
    }

    // If still invalid, throw an error
    if (!isValid(date)) {
      throw new Error('Invalid date format');
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatViews = (views: number): string => {
  if (!views && views !== 0) return '0 views';
  
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

export const getVideoCreationDate = (): string => {
  return new Date().toISOString();
};