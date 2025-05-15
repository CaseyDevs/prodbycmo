import { prisma } from "@/lib/prisma"

export async function getFeaturedBeats() {
    return prisma.beat.findMany({
        where: { featured: true }, 
        include: { artists: true },
      });
}