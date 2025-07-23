export type ItemModel = {
  id: string;
  public: boolean;
  name: string;
  description?: string;
  purchaseDate?: Date;
  price?: number;
  hasWarranty?: boolean;
  warrantyType?: string;
  warrantyLength?: number;
  createdAt: Date;
  updatedAt: Date;
  homeId?: string;
  rooms?: Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    homeId: string;
  }>;
  ownerId: string;
  owner?: {
    email: string;
    id: string;
    name: string;
  };
  mediaUrls?: string[];
};
