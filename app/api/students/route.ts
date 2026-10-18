import prisma from "@/app/lib/prisma";
import { isPrismaError, parseStudentRequest } from "@/app/lib/student-api";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const parsed = await parseStudentRequest(request);

  if (!parsed.success) {
    return parsed.response;
  }

  try {
    const student = await prisma.student.create({
      data: parsed.data,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "รหัสนักศึกษานี้ถูกใช้งานแล้ว" },
        { status: 409 },
      );
    }

    console.error("Failed to create student:", error);
    return NextResponse.json(
      { message: "ไม่สามารถสร้างข้อมูลนักศึกษาได้" },
      { status: 500 },
    );
  }
}
