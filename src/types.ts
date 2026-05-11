export interface Task {
  id: string;
  itemName: string;
  basePrice: number;
  commission: number;
  totalPrice: number;
  notes: string;
  requesterId: string;
  requesterName: string;
  runnerId: string | null;
  runnerName: string | null;
  status: 'pending' | 'accepted' | 'delivered';
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  username: string;
  email: string;
  createdAt: any;
}
