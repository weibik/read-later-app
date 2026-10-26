export type Bookmark = {
  id: number;
  url: string;
  status: 'pending' | 'complete' | 'failed';
  title: string;
  description: string;
  image: string;
  tags: string[];
};
