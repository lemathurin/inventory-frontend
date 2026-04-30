import bcrypt from "bcryptjs";
import { prisma } from "@/server/prisma";

export const createUser = async (
  email: string,
  password: string,
  name: string,
) =>
  prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      name,
    },
  });

export const findUserByEmail = async (email: string) =>
  prisma.user.findUnique({
    where: { email },
    include: {
      homes: {
        select: {
          homeId: true,
          home: {
            select: { id: true },
          },
        },
      },
    },
  });

export const findUserById = async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      homes: {
        select: {
          homeId: true,
          home: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
      items: {
        select: {
          item: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  });

export const findUserAuthById = async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
    },
  });

export const updateUserName = async (userId: string, name: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, name: true, email: true },
  });

export const updateUserEmail = async (userId: string, email: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { email },
    select: { id: true, name: true, email: true },
  });

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
    select: { id: true, name: true, email: true },
  });
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
) => bcrypt.compare(plainPassword, hashedPassword);

export const deleteUser = async (userId: string) =>
  prisma.$transaction(async (tx) => {
    await tx.userItem.deleteMany({ where: { userId } });
    await tx.item.deleteMany({ where: { users: { some: { userId } } } });

    await tx.userHome.deleteMany({ where: { userId } });
    await tx.home.deleteMany({ where: { users: { some: { userId } } } });

    return tx.user.delete({
      where: { id: userId },
    });
  });

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
