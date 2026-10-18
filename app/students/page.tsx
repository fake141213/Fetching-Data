import prisma from "@/app/lib/prisma";
import DeleteButton from "./delete-button";
import SearchForm from "./search-form";

type StudentsPageProps = {
  searchParams: Promise<{
    search?: string;
    major?: string;
    status?: string;
  }>;
};

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const major = params.major?.trim() ?? "";
  const status = params.status === "active" || params.status === "inactive"
    ? params.status
    : "";

  const [students, majorRows] = await Promise.all([
    prisma.student.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { studentCode: { contains: search } },
                  { name: { contains: search } },
                ],
              }
            : {},
          major ? { major } : {},
          status ? { status: status === "active" } : {},
        ],
      },
      orderBy: { id: "asc" },
    }),
    prisma.student.findMany({
      select: { major: true },
      distinct: ["major"],
      orderBy: { major: "asc" },
    }),
  ]);

  const majors = majorRows.map((row) => row.major);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Student records
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            จัดการข้อมูลนักศึกษา
          </h1>
          <p className="mt-2 text-slate-600">
            ค้นหา เพิ่ม แก้ไข และจัดการข้อมูลนักศึกษา
          </p>
        </div>
        <a
          href="/students/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + เพิ่มนักศึกษา
        </a>
      </header>

      <SearchForm
        search={search}
        major={major}
        status={status}
        majors={majors}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">รายชื่อนักศึกษา</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {students.length} รายการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">รหัสนักศึกษา</th>
                <th className="px-5 py-3.5 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-5 py-3.5 font-semibold">อีเมล</th>
                <th className="px-5 py-3.5 font-semibold">สาขา</th>
                <th className="px-5 py-3.5 text-center font-semibold">ชั้นปี</th>
                <th className="px-5 py-3.5 font-semibold">สถานะ</th>
                <th className="px-5 py-3.5 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                    {student.studentCode}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-800">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {student.email || "-"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {student.major}
                  </td>
                  <td className="px-5 py-4 text-center text-slate-600">
                    {student.year}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.status
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {student.status ? "กำลังศึกษา" : "พ้นสภาพ"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/students/edit/${student.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        แก้ไข
                      </a>
                      <DeleteButton id={student.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="font-medium text-slate-700">
                      ไม่พบข้อมูลนักศึกษา
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือเพิ่มนักศึกษาใหม่
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
