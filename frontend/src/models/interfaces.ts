export interface Usuario {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface Prenda {
  id: number;
  userId: number;
  name: string;
  category: string;
  color: string | null;
  imageUrl: string | null;
}

export interface Outfit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  itemIds: number[];
}
