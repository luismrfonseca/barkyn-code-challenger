interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export default function ProgressBar({ completed, total, percentage }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          O seu progresso: {completed}/{total} cursos
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
