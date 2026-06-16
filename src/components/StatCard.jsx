export default function StatCard({ label, value, helper, icon: Icon, tone = 'slate' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-black mt-2 tracking-tight text-slate-950">{value}</h3>
          {helper && <p className="text-sm text-slate-400 mt-1">{helper}</p>}
        </div>
        {Icon && (
          <div className={`h-11 w-11 rounded-2xl grid place-items-center ring-1 ${tones[tone]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
