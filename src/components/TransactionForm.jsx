import { useState } from 'react';
import { categories } from '../utils/finance';
import CustomSelect from './CustomSelect';

const initialState = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

const transactionTypes = ['expense', 'income'];

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
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-sm">
      <input
        name="title"
        value={form.title}
        onChange={updateField}
        placeholder="Title"
        required
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      <input
        name="amount"
        value={form.amount}
        onChange={updateField}
        placeholder="Amount"
        type="number"
        step="0.01"
        required
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      <CustomSelect
        name="type"
        value={form.type}
        options={transactionTypes}
        onChange={updateField}
      />

      <CustomSelect
        name="category"
        value={form.category}
        options={categories}
        onChange={updateField}
      />

      <input
        name="date"
        value={form.date}
        onChange={updateField}
        type="date"
        required
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      <input
        name="notes"
        value={form.notes}
        onChange={updateField}
        placeholder="Notes"
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      <button className="md:col-span-2 lg:col-span-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]">
        Add transaction
      </button>
    </form>
  );
}
