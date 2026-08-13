'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to determine Juz start pages
const JUZ_PAGES = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282,
  302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582, 604
];

export async function createKhatmahPlan(data: {
  targetDays: number;
  isGroup: boolean;
  groupName?: string;
  guestName?: string;
}) {
  const pagesPerDay = Math.ceil(604 / data.targetDays);
  const joinCode = data.isGroup ? Math.random().toString(36).substring(2, 8).toUpperCase() : null;

  try {
    const khatmah = await prisma.khatmahPlan.create({
      data: {
        targetDays: data.targetDays,
        pagesPerDay,
        isGroup: data.isGroup,
        groupName: data.groupName,
        groupJoinCode: joinCode,
      }
    });

    if (data.isGroup) {
      // Create 30 assignments for the 30 Juz
      const assignments = Array.from({ length: 30 }).map((_, i) => ({
        khatmahId: khatmah.id,
        juzNumber: i + 1,
        startPage: JUZ_PAGES[i],
        endPage: JUZ_PAGES[i + 1] - 1,
        status: "PENDING"
      }));
      await prisma.khatmahAssignment.createMany({ data: assignments });
    }

    return { success: true, khatmah };
  } catch (error: any) {
    console.error('Failed to create khatmah:', error);
    return { success: false, error: error.message };
  }
}

export async function getKhatmahDetails(id: string) {
  try {
    const khatmah = await prisma.khatmahPlan.findUnique({
      where: { id },
      include: {
        assignments: {
          orderBy: { juzNumber: 'asc' }
        }
      }
    });
    return { success: true, khatmah };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getKhatmahByJoinCode(code: string) {
  try {
    const khatmah = await prisma.khatmahPlan.findUnique({
      where: { groupJoinCode: code },
    });
    return { success: !!khatmah, khatmah };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function claimAssignment(assignmentId: string, guestName: string) {
  try {
    const assignment = await prisma.khatmahAssignment.update({
      where: { id: assignmentId },
      data: {
        guestName,
        status: "READING"
      }
    });
    revalidatePath('/'); // or specific path if we have a khatmah page
    return { success: true, assignment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completeAssignment(assignmentId: string) {
  try {
    const assignment = await prisma.khatmahAssignment.update({
      where: { id: assignmentId },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });
    revalidatePath('/');
    return { success: true, assignment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
