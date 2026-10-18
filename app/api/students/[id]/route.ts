import prisma from "@/app/lib/prisma";
import {
  isPrismaError,
  parseStudentId,
  parseStudentRequest,
} from "@/app/lib/student-api";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function invalidStudentIdResponse() {
  return NextResponse.json(
    { message: "Student ID ไม่ถูกต้อง" },
    { status: 400 },
  );
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const studentId = parseStudentId(id);

  if (studentId === null) {
    return invalidStudentIdResponse();
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลนักศึกษา" },
        { status: 404 },
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Failed to retrieve student:", error);
    return NextResponse.json(
      { message: "ไม่สามารถดึงข้อมูลนักศึกษาได้" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const studentId = parseStudentId(id);

  if (studentId === null) {
    return invalidStudentIdResponse();
  }

  const parsed = await parseStudentRequest(request);

  if (!parsed.success) {
    return parsed.response;
  }

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: parsed.data,
    });

    return NextResponse.json(student);
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "รหัสนักศึกษานี้ถูกใช้งานแล้ว" },
        { status: 409 },
      );
    }

    if (isPrismaError(error, "P2025")) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลนักศึกษา" },
        { status: 404 },
      );
    }

    console.error("Failed to update student:", error);
    return NextResponse.json(
      { message: "ไม่สามารถแก้ไขข้อมูลนักศึกษาได้" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const studentId = parseStudentId(id);

  if (studentId === null) {
    return invalidStudentIdResponse();
  }

  try {
    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json({
      message: "ลบนักศึกษาเรียบร้อยแล้ว",
    });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลนักศึกษา" },
        { status: 404 },
      );
    }

    console.error("Failed to delete student:", error);
    return NextResponse.json(
      { message: "ไม่สามารถลบข้อมูลนักศึกษาได้" },
      { status: 500 },
    );
  }
}
