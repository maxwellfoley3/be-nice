import { Photo } from "./photo";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    sentimentLabel: string;
    sentimentScore: number;
    author: {
        id: number;
        email: string;
    };
    photo: Photo;
    authorPhoto: string;
}