import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MonthlyLineChart({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-80">
      <div className="mb-4">
        <h3 className="font-black text-slate-950">Monthly trend</h3>
        <p className="text-sm text-slate-500">Income vs expenses over time</p>
      </div>

      {!data?.length ? (
        <div className="h-[80%] grid place-items-center text-slate-400 text-sm">Add transactions to see the trend.</div>
      ) : (
        <ResponsiveContainer width="100%" height="82%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={value => `€${Number(value).toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
