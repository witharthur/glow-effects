import { cn } from "@/lib/utils";
import type { FilterKey } from "./types";

const tabs: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "free", label: "Бесплатные" },
  { key: "paid", label: "Платные" },
];

export const FilterTabs = ({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (k: FilterKey) => void;
}) => (
  <div 
    className="flex items-center justify-center mx-auto"
    style={{
      width: '361px',
      height: '38px',
      borderRadius: '999px',
      background: 'rgba(255, 255, 255, 1)',
      border: '1px solid rgba(232, 236, 239, 1)',
      gap: '0px',
      padding: '0px',
      marginBottom: '15px',
    }}
  >
    {tabs.map((t) => {
      const active = value === t.key;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            flex: 1,
            height: '38px',
            borderRadius: '22px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 200ms',
            border: 'none',
            cursor: 'pointer',
            background: active ? 'rgba(97, 21, 205, 1)' : 'transparent',
            color: active ? 'white' : 'rgba(168, 170, 172, 1)',
          }}
          onMouseEnter={(e) => {
            if (!active) {
              (e.target as HTMLButtonElement).style.color = 'rgba(17, 20, 22, 1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              (e.target as HTMLButtonElement).style.color = 'rgba(168, 170, 172, 1)';
            }
          }}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);
