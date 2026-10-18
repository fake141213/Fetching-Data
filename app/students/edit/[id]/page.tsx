import prisma from "@/app/lib/prisma";
import { parseStudentId } from "@/app/lib/student-api";
import { notFound } from "next/navigation";
import StudentForm from "../../student-form";

type EditStudentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;
  const studentId = parseStudentId(id);

  if (studentId === null) {
    notFound();
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-7">
        <a
          href="/students"
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          ← กลับไปหน้ารายชื่อนักศึกษา
        </a>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          แก้ไขข้อมูลนักศึกษา
        </h1>
        <p className="mt-2 text-slate-600">
          แก้ไขข้อมูลของ {student.name}
        </p>
      </header>
      <StudentForm
        studentId={student.id}
        initialValues={{
          studentCode: student.studentCode,
          name: student.name,
          email: student.email,
          major: student.major,
          year: student.year,
        }}
      />
    </main>
  );
}
