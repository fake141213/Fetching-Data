"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteButtonProps = {
  id: number;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm("ยืนยันการลบข้อมูลนักศึกษารายนี้หรือไม่?")) {
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const result: unknown = await response.json();
        setError(
          typeof result === "object" &&
            result !== null &&
            "message" in result &&
            typeof result.message === "string"
            ? result.message
            : "ไม่สามารถลบข้อมูลนักศึกษาได้",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองอีกครั้ง");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "กำลังลบ..." : "ลบ"}
      </button>
      {error && (
        <span role="alert" className="max-w-40 text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
