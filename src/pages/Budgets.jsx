import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBudget, deleteBudget, subscribeToBudgets } from '../services/budgets';
import { subscribeToTransactions } from '../services/transactions';
import { categories, formatCurrency } from '../utils/finance';

export default function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ category: 'Food', limit: '', month: new Date().toISOString().slice(0, 7) });

  useEffect(() => subscribeToBudgets(user.uid, setBudgets), [user.uid]);
  useEffect(() => subscribeToTransactions(user.uid, setTransactions), [user.uid]);

  async function handleSubmit(event) {
    event.preventDefault();
    await createBudget(user.uid, form);
    setForm({ category: 'Food', limit: '', month: new Date().toISOString().slice(0, 7) });
  }

  function spentForBudget(budget) {
    return transactions
      .filter(t => t.type === 'expense' && t.category === budget.category && t.date?.startsWith(budget.month))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-slate-500">Set monthly limits by category.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-5 grid md:grid-cols-4 gap-4">
        <select className="border rounded-xl px-4 py-3" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {categories.map(category => <option key={category}>{category}</option>)}
        </select>
        <input className="border rounded-xl px-4 py-3" type="number" placeholder="Limit" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} required />
        <input className="border rounded-xl px-4 py-3" type="month" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required />
        <button className="bg-slate-950 text-white rounded-xl py-3">Add budget</button>
      </form>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map(budget => {
          const spent = spentForBudget(budget);
          const percent = Math.min(Math.round((spent / budget.limit) * 100), 100);
          return (
            <div key={budget.id} className="bg-white border rounded-2xl p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{budget.category}</h3>
                  <p className="text-sm text-slate-500">{budget.month}</p>
                </div>
                <button onClick={() => deleteBudget(user.uid, budget.id)} className="text-sm text-red-600">Delete</button>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-sm mb-2">
                  <span>{formatCurrency(spent)}</span>
                  <span>{formatCurrency(budget.limit)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
