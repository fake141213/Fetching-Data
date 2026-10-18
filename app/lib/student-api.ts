import { Prisma } from "@/app/generated/prisma/client";
import { studentSchema } from "@/app/students/validation";
import { NextResponse } from "next/server";

export async function parseStudentRequest(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false as const,
      response: NextResponse.json(
        { message: "รูปแบบ JSON ไม่ถูกต้อง" },
        { status: 400 },
      ),
    };
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      success: false as const,
      response: NextResponse.json(
        { message: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      ),
    };
  }

  const fields = body as Record<string, unknown>;
  const result = studentSchema.safeParse({
    studentCode: fields.studentCode,
    name: fields.name,
    email: fields.email ?? "",
    major: fields.major,
    year: Number(fields.year),
  });

  if (!result.success) {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          message: "ข้อมูลไม่ถูกต้อง",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      ),
    };
  }

  return { success: true as const, data: result.data };
}

export function parseStudentId(id: string) {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const studentId = Number(id);
  return Number.isSafeInteger(studentId) ? studentId : null;
}

export function isPrismaError(
  error: unknown,
  code: string,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}
