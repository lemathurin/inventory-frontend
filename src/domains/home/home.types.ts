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