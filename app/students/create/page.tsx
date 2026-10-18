import StudentForm from "../student-form";

export default function CreateStudentPage() {
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
          เพิ่มนักศึกษา
        </h1>
        <p className="mt-2 text-slate-600">
          กรอกข้อมูลนักศึกษาให้ครบถ้วนเพื่อเพิ่มลงในระบบ
        </p>
      </header>
      <StudentForm />
    </main>
  );
}
