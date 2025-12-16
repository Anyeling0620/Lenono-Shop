export type RoastStatus = 'pending' | 'processing' | 'replied' | 'resolved';

export interface RoastItem {
  id: number;
  title: string;
  content: string;
  rating: number;
  status: RoastStatus;
  time: string;
  reply?: string;
}
