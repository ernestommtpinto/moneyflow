import { formatCurrency } from '../utils/finance';

export default function TransactionTable({ transactions, onDelete }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Title</th>
            <th className="text-left p-4">Category</th>
            <th className="text-left p-4">Type</th>
            <th className="text-right p-4">Amount</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-t">
              <td className="p-4">{t.date}</td>
              <td className="p-4 font-medium">{t.title}</td>
              <td className="p-4">{t.category}</td>
              <td className="p-4 capitalize">{t.type}</td>
              <td className={`p-4 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(t.amount)}
              </td>
              <td className="p-4 text-right">
                <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
          {!transactions.length && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-slate-500">No transactions yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
