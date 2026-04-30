import { prisma } from "@/server/prisma";
import { generateInviteCode } from "@/server/utils/invite-codes";

export const createNewHome = async (
  name: string,
  address: string,
  userId: string,
) =>
  prisma.home.create({
    data: {
      name,
      address,
      users: {
        create: {
          userId,
          admin: true,
        },
      },
    },
    include: {
      users: true,
    },
  });

export const findHomeById = async (id: string, userId?: string) =>
  prisma.home.findUnique({
    where: { id: String(id) },
    include: {
      users: true,
      rooms: {
        include: {
          users: userId
            ? {
                where: { userId },
              }
            : false,
        },
      },
      items: true,
    },
  });

export const findRoomsByHomeId = async (homeId: string) =>
  prisma.room.findMany({
    where: { homeId: String(homeId) },
    include: {
      items: true,
      users: true,
    },
  });

export const updateHomeById = async (
  id: string,
  data: { name?: string; address?: string },
) =>
  prisma.home.update({
    where: { id: String(id) },
    data: {
      name: data.name,
      address: data.address,
    },
    include: {
      users: true,
      items: true,
    },
  });

export const deleteHomeById = async (id: string) => {
  await prisma.userHome.deleteMany({
    where: { homeId: id },
  });

  return prisma.home.delete({
    where: { id: String(id) },
  });
};

export const createHomeInvite = async (
  homeId: string,
  userId: string,
  expiresAt?: Date,
) => {
  let code = "";
  let attempts = 0;

  do {
    code = generateInviteCode();
    attempts += 1;
    if (attempts > 5) {
      throw new Error("Failed to generate unique invite code");
    }
  } while (await prisma.homeInvite.findUnique({ where: { code } }));

  return prisma.homeInvite.create({
    data: {
      code,
      homeId,
      userId,
      expiresAt,
    },
  });
};

export const findHomeInvites = async (homeId: string) =>
  prisma.homeInvite.findMany({
    where: { homeId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

export const deleteHomeInvite = async (inviteId: string) =>
  prisma.homeInvite.delete({
    where: { id: inviteId },
  });

export const findInviteByCode = async (code: string) =>
  prisma.homeInvite.findUnique({
    where: { code },
    include: { home: true },
  });

export const addUserToHome = async (
  homeId: string,
  userId: string,
  admin = false,
) =>
  prisma.userHome.create({
    data: {
      homeId,
      userId,
      admin,
    },
  });

export const findUserHomeMembership = async (
  userId: string,
  homeId: string,
) =>
  prisma.userHome.findFirst({
    where: { userId, homeId },
  });

export const findUsersByHomeId = async (homeId: string) => {
  const userHomes = await prisma.userHome.findMany({
    where: { homeId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return userHomes.map(({ user, ...rest }) => ({
    ...rest,
    name: user.name,
    email: user.email,
  }));
};

export const removeUserFromHome = async (homeId: string, userId: string) =>
  prisma.userHome.delete({
    where: {
      userId_homeId: {
        userId,
        homeId,
      },
    },
  });
