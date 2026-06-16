import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

export default function ExpensePieChart({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-80">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-black text-slate-950">Expenses by category</h3>
          <p className="text-sm text-slate-500">Where your money is going</p>
        </div>
      </div>

      {!data?.length ? (
        <div className="h-[80%] grid place-items-center text-slate-400 text-sm">Add expenses to see this chart.</div>
      ) : (
        <ResponsiveContainer width="100%" height="82%">
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" outerRadius={88} innerRadius={48} paddingAngle={4} label>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={value => `€${Number(value).toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={24} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
