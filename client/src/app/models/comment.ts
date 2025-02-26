import { Photo } from "./photo";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        email: string;
        photos: Photo[];
    };
}