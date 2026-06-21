import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBudget, deleteBudget, subscribeToBudgets } from '../services/budgets';
import { subscribeToTransactions } from '../services/transactions';
import { categories, formatCurrency } from '../utils/finance';
import CustomSelect from '../components/CustomSelect';

export default function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    category: 'Food',
    limit: '',
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => subscribeToBudgets(user.uid, setBudgets), [user.uid]);
  useEffect(() => subscribeToTransactions(user.uid, setTransactions), [user.uid]);

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

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
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Budgets</h1>
        <p className="text-slate-500">Set monthly limits by category.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-5 grid md:grid-cols-4 gap-4 shadow-sm">
        <CustomSelect
          name="category"
          value={form.category}
          options={categories}
          onChange={updateField}
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          type="number"
          placeholder="Limit"
          value={form.limit}
          onChange={e => setForm({ ...form, limit: e.target.value })}
          required
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          type="month"
          value={form.month}
          onChange={e => setForm({ ...form, month: e.target.value })}
          required
        />

        <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]">
          Add budget
        </button>
      </form>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map(budget => {
          const spent = spentForBudget(budget);
          const percent = Math.min(Math.round((spent / budget.limit) * 100), 100);

          return (
            <div key={budget.id} className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-950">{budget.category}</h3>
                  <p className="text-sm text-slate-500">{budget.month}</p>
                </div>
                <button onClick={() => deleteBudget(user.uid, budget.id)} className="text-sm font-bold text-red-600 hover:underline">
                  Delete
                </button>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-sm mb-2">
                  <span>{formatCurrency(spent)}</span>
                  <span>{formatCurrency(budget.limit)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
