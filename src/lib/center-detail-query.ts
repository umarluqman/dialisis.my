import { Prisma } from "@/generated/prisma/client";

export const centerDetailSelect = {
  id: true,
  slug: true,
  dialysisCenterName: true,
  sector: true,
  drInCharge: true,
  drInChargeTel: true,
  address: true,
  addressWithUnit: true,
  tel: true,
  fax: true,
  panelNephrologist: true,
  centreManager: true,
  centreCoordinator: true,
  email: true,
  hepatitisBay: true,
  longitude: true,
  latitude: true,
  phoneNumber: true,
  website: true,
  title: true,
  units: true,
  description: true,
  benefits: true,
  photos: true,
  videos: true,
  stateId: true,
  createdAt: true,
  updatedAt: true,
  town: true,
  featured: true,
  state: {
    select: {
      name: true,
    },
  },
  images: {
    where: {
      isActive: true,
    },
    select: {
      url: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  },
} satisfies Prisma.DialysisCenterSelect;

export type CenterDetail = Prisma.DialysisCenterGetPayload<{
  select: typeof centerDetailSelect;
}>;
