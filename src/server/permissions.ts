import { prisma } from "@/server/prisma";

type EntityType = "home" | "room" | "item";

export const requireEntityAdmin = async (
  entityType: EntityType,
  resourceId: string,
  userId: string,
) => {
  switch (entityType) {
    case "home":
      return Boolean(
        await prisma.userHome.findFirst({
          where: {
            homeId: resourceId,
            userId,
            admin: true,
          },
        }),
      );
    case "room":
      return Boolean(
        await prisma.userRoom.findFirst({
          where: {
            roomId: resourceId,
            userId,
            admin: true,
          },
        }),
      );
    case "item":
      return Boolean(
        await prisma.userItem.findFirst({
          where: {
            itemId: resourceId,
            userId,
            admin: true,
          },
        }),
      );
  }
};
