import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface UserPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isOwner: boolean;
  role?: string;
}

/**
 * Check if a user has permission to access a specific dialysis center
 */
export async function checkDialysisCenterPermission(
  dialysisCenterId: string,
  userId?: string
): Promise<UserPermissions> {
  if (!userId) {
    return {
      canView: true, // Public can view
      canEdit: false,
      canDelete: false,
      isOwner: false,
    };
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      isOwner: false,
      role: "ADMIN",
    };
  }

  // Check user's relationship with the dialysis center
  const userDialysisCenter = await prisma.userDialysisCenter.findUnique({
    where: {
      userId_dialysisCenterId: {
        userId,
        dialysisCenterId,
      },
    },
  });

  if (!userDialysisCenter) {
    return {
      canView: true, // Public can view
      canEdit: false,
      canDelete: false,
      isOwner: false,
    };
  }

  return {
    canView: true,
    canEdit: userDialysisCenter.role === "OWNER" || userDialysisCenter.role === "MANAGER",
    canDelete: userDialysisCenter.role === "OWNER",
    isOwner: userDialysisCenter.role === "OWNER",
    role: userDialysisCenter.role,
  };
}

/**
 * Get all dialysis centers that a user can manage
 */
export async function getUserDialysisCenters(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      dialysisCenters: {
        include: {
          dialysisCenter: {
            include: {
              state: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return [];
  }

  // If admin, return all dialysis centers
  if (user.role === "ADMIN") {
    return await prisma.dialysisCenter.findMany({
      include: {
        state: true,
        users: true,
      },
    });
  }

  // Return user's dialysis centers with their roles
  return user.dialysisCenters.map((udc) => ({
    ...udc.dialysisCenter,
    userRole: udc.role,
  }));
}

/**
 * Create a new dialysis center for a user
 */
export async function createDialysisCenterForUser(
  userId: string,
  dialysisCenterData: any
) {
  const dialysisCenter = await prisma.dialysisCenter.create({
    data: {
      ...dialysisCenterData,
      users: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
    include: {
      state: true,
      users: true,
    },
  });

  return dialysisCenter;
}

/**
 * Add a user to a dialysis center with a specific role
 */
export async function addUserToDialysisCenter(
  dialysisCenterId: string,
  userEmail: string,
  role: "OWNER" | "MANAGER" | "VIEWER"
) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userDialysisCenter = await prisma.userDialysisCenter.create({
    data: {
      userId: user.id,
      dialysisCenterId,
      role,
    },
    include: {
      user: true,
      dialysisCenter: true,
    },
  });

  return userDialysisCenter;
}

/**
 * Get current user's session with authorization check
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}