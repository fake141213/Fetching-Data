type SearchFormProps = {
  search: string;
  major: string;
  status: string;
  majors: string[];
};

export default function SearchForm({
  search,
  major,
  status,
  majors,
}: SearchFormProps) {
  const availableMajors = major && !majors.includes(major)
    ? [...majors, major].sort((left, right) => left.localeCompare(right))
    : majors;

  return (
    <form
      method="GET"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)_minmax(10rem,1fr)]">
        <div>
          <label
            htmlFor="search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            ค้นหารหัสหรือชื่อ
          </label>
          <input
            id="search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="กรอกรหัสนักศึกษาหรือชื่อ"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            defaultValue={major}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">ทุกสาขา</option>
            {availableMajors.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            สถานะ
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">กำลังศึกษา</option>
            <option value="inactive">พ้นสภาพ</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          ค้นหา
        </button>
        <a
          href="/students"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ล้างตัวกรอง
        </a>
      </div>
    </form>
  );
}
