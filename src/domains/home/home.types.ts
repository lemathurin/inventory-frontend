export interface HomeModel {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  rooms?: Array<{
    id: string;
    name: string;
  }>;
  items?: Array<{
    id: string;
    name: string;
  }>;
}

export interface InviteModel {
  id: string;
  code: string;
  userId: string;
  homeId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
