"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type StudentFormValues = {
  studentCode: string;
  name: string;
  email: string | null;
  major: string;
  year: number;
};

type StudentFormProps = {
  initialValues?: StudentFormValues;
  studentId?: number;
};

export default function StudentForm({
  initialValues,
  studentId,
}: StudentFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isEditing = studentId !== undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const year = Number(formData.get("year"));

    if (!Number.isInteger(year)) {
      setError("ชั้นปีต้องเป็นจำนวนเต็ม");
      setPending(false);
      return;
    }

    try {
      const response = await fetch(
        isEditing ? `/api/students/${studentId}` : "/api/students",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentCode: formData.get("studentCode"),
            name: formData.get("name"),
            email: formData.get("email"),
            major: formData.get("major"),
            year,
          }),
        },
      );
      const result: unknown = await response.json();

      if (!response.ok) {
        if (
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
        ) {
          setError(result.message);
        } else {
          setError("ไม่สามารถบันทึกข้อมูลนักศึกษาได้");
        }
        return;
      }

      router.push("/students");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองอีกครั้ง");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="studentCode"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            รหัสนักศึกษา
          </label>
          <input
            id="studentCode"
            name="studentCode"
            required
            maxLength={20}
            defaultValue={initialValues?.studentCode}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            ชื่อ-นามสกุล
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={100}
            defaultValue={initialValues?.name}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            อีเมล <span className="font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initialValues?.email ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="major"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            สาขา
          </label>
          <select
            id="major"
            name="major"
            required
            defaultValue={initialValues?.major ?? "Information Technology"}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {![
              "Information Technology",
              "Computer Science",
              "Digital Technology",
            ].includes(initialValues?.major ?? "") &&
              initialValues?.major && (
                <option value={initialValues.major}>{initialValues.major}</option>
              )}
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Computer Science">Computer Science</option>
            <option value="Digital Technology">Digital Technology</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            ชั้นปี
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={1}
            max={8}
            step={1}
            required
            defaultValue={initialValues?.year ?? 1}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก..." : isEditing ? "บันทึกการแก้ไข" : "เพิ่มนักศึกษา"}
        </button>
        <a
          href="/students"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ยกเลิก
        </a>
      </div>
    </form>
  );
}
