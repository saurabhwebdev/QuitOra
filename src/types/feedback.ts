export interface FeedbackType {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement';
  status: 'pending' | 'under-review' | 'planned' | 'in-progress' | 'completed' | 'declined';
  votes: string[];
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  createdAt: Date;
} 