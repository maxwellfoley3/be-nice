import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get the most recently uploaded photo for a user
// this is used to display the photo next to the comments

export const getCurrentPhotoForUser = async (userId: number) => {
  const photo = await prisma.photo.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return photo;
};