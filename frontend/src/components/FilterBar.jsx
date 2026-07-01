const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
];

export default function FilterBar({ active, onChange, counts }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            active === value
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
          {counts?.[value] !== undefined && (
            <span
              className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
                active === value ? "bg-indigo-50 text-indigo-500" : "bg-gray-200 text-gray-500"
              }`}
            >
              {counts[value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
