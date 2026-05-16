// Enums sincronizados con el backend (valores en español)
export type ItemSeason = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno' | 'Todo el año';
export type ItemStatus = 'Disponible' | 'Lavandería' | 'Prestado';

export interface Usuario {
  id:       number;
  username: string;
  email:    string;
  role:     'Admin' | 'User';
}

export interface Prenda {
  id:        number;
  userId:    number;
  name:      string;
  category:  string;
  color:     string;
  imageUrl:  string;
  season:    ItemSeason;
  size:      string;
  fabric:    string | null;
  status:    ItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Outfit {
  id:          number;
  userId:      number;
  name:        string;
  description: string | null;
  itemIds:     number[];
  createdAt?:  string;
  updatedAt?:  string;
}

/** Outfit con sus prendas incluidas (respuesta de GET /api/outfits/:id) */
export interface OutfitDetalle extends Outfit {
  items: Prenda[];
}
