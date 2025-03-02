export interface Photo {
    id: number;
    imageUrl: string;
    userId: number;
    user?: {
      id: number;
      email: string;
    };
  }