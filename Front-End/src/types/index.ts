export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'sender' | 'carrier';
  wallet: {
    balance: number;
    blocked: number;
  };
}

export interface Trip {
  id: string;
  carrierId: string;
  source: string;
  destination: string;
  travelDate: string;
  capacity: number;
  price: number;
  status: 'available' | 'booked' | 'completed';
}

export interface Package {
  id: string;
  senderId: string;
  carrierId?: string;
  source: string;
  destination: string;
  weight: number;
  description: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  pickupLocation?: string;
  dropLocation?: string;
}