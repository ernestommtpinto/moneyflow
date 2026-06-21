import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ label, name, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function selectOption(option) {
    onChange({
      target: {
        name,
        value: option,
      },
    });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="mb-2 block text-sm font-bold text-slate-700">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
      >
        <span>{value}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
          <div className="max-h-64 overflow-auto p-1">
            {options.map(option => {
              const active = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span>{option}</span>
                  {active && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
