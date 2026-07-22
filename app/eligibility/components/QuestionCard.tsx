"use client";

type Props = {
  title: string;
  value: string;
  options?: string[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function QuestionCard({
  title,
  value,
  options,
  placeholder,
  onChange,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-10 shadow-xl">

      <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A]">
        {title}
      </h2>

      {options ? (
        <div className="space-y-4">

          {options.map((option) => (

            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full rounded-2xl border-2 p-5 text-left text-lg font-medium transition-all duration-300 ${
                value === option
                  ? "border-[#D4AF37] bg-[#FFF8E1] shadow-lg"
                  : "border-gray-200 hover:border-[#D4AF37] hover:bg-gray-50"
              }`}
            >
              {option}
            </button>

          ))}

        </div>
      ) : (

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border-2 border-gray-200 p-5 text-lg focus:border-[#D4AF37] focus:outline-none"
        />

      )}

    </div>
  );
}