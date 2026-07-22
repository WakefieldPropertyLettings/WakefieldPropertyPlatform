type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: Props) {
  const progress = (current / total) * 100;

  return (
    <div className="mb-10">

      <div className="mb-3 flex justify-between">

        <span className="font-semibold text-[#0B1F3A]">
          Question {current} of {total}
        </span>

        <span className="font-bold text-[#D4AF37]">
          {Math.round(progress)}%
        </span>

      </div>

      <div className="h-4 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}