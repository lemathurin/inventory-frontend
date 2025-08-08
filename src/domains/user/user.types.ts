export interface UserModel {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  admin?: boolean;
  homes?: Array<{
    homeId: string;
    admin: boolean;
    home: {
      id: string;
      name: string;
      address: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  items?: Array<{
    itemId: string;
    admin: boolean;
    item: {
      id: string;
      name: string;
      description: string;
      public: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  rooms?: Array<{
    roomId: string;
    admin: boolean;
    room: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}
