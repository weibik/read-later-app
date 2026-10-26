export type Bookmark = {
  id: number;
  url: string;
  status: 'pending' | 'complete' | 'failed';
  title: string | null;
  description: string | null;
  image: string | null;
  tags: string[];
};
