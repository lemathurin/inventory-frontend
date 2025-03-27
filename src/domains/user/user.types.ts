export interface UserModel {
  id: string;
  name: string;
  email: string;
  homes?: Array<{
    homeId: string;
    home: {
      id: string;
      name: string;
      address: string;
    };
  }>;
  items?: Array<{
    item: {
      id: string;
      name: string;
      description: string;
    };
  }>;
} 