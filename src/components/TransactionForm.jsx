import { useState } from 'react';
import { categories } from '../utils/finance';

const initialState = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <input name="title" value={form.title} onChange={updateField} placeholder="Title" required className="border rounded-xl px-4 py-3" />
      <input name="amount" value={form.amount} onChange={updateField} placeholder="Amount" type="number" step="0.01" required className="border rounded-xl px-4 py-3" />
      <select name="type" value={form.type} onChange={updateField} className="border rounded-xl px-4 py-3">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select name="category" value={form.category} onChange={updateField} className="border rounded-xl px-4 py-3">
        {categories.map(category => <option key={category}>{category}</option>)}
      </select>
      <input name="date" value={form.date} onChange={updateField} type="date" required className="border rounded-xl px-4 py-3" />
      <input name="notes" value={form.notes} onChange={updateField} placeholder="Notes" className="border rounded-xl px-4 py-3" />
      <button className="md:col-span-2 lg:col-span-3 bg-slate-950 text-white rounded-xl py-3 hover:bg-slate-800">
        Add transaction
      </button>
    </form>
  );
}
