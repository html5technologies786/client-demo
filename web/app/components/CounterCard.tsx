interface CounterCardProps {
  title: string;
  value: number | null;
  icon: string;
  color: string;
}

export default function CounterCard({ title, value, icon, color }: CounterCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <span className={`text-2xl p-2 rounded-xl ${color}`}>{icon}</span>
      </div>
      <div className="text-5xl font-extrabold text-gray-800 tabular-nums">
        {value === null ? (
          <span className="text-gray-300 animate-pulse">—</span>
        ) : (
          value.toLocaleString()
        )}
      </div>
    </div>
  );
}
