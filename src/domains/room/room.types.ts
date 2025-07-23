export interface RoomModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  homeId: string;
  // home?: {
  //   id: string;
  //   name: string;
  //   address: string;
  // };
  users?: {
    userId: string;
    admin: boolean;
  }[];
  items?: {
    id: string;
    name: string;
    public: boolean;
    price?: number;
    hasWarranty?: boolean;
    warrantyType?: string;
    warrantyLength?: number;
    createdAt: string;
    updatedAt: string;
  }[];
}
