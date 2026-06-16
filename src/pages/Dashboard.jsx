import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from 'lucide-react';
import StatCard from '../components/StatCard';
import ExpensePieChart from '../components/ExpensePieChart';
import MonthlyLineChart from '../components/MonthlyLineChart';
import { useAuth } from '../context/AuthContext';
import { subscribeToTransactions } from '../services/transactions';
import { calculateSummary, expensesByCategory, formatCurrency, monthlyTotals } from '../utils/finance';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => subscribeToTransactions(user.uid, setTransactions), [user.uid]);

  const summary = calculateSummary(transactions);
  const latestTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-0 h-28 w-28 rounded-full bg-white/10" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-white/75 font-medium">Current balance</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">{formatCurrency(summary.balance)}</h1>
            <p className="mt-3 text-white/80">Track your income, expenses and savings progress in one place.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="rounded-3xl bg-white/15 backdrop-blur p-4 border border-white/20">
              <p className="text-sm text-white/70">Income</p>
              <p className="text-xl font-black">{formatCurrency(summary.income)}</p>
            </div>
            <div className="rounded-3xl bg-white/15 backdrop-blur p-4 border border-white/20">
              <p className="text-sm text-white/70">Expenses</p>
              <p className="text-xl font-black">{formatCurrency(summary.expenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Balance" value={formatCurrency(summary.balance)} helper="Total available" icon={Wallet} tone="blue" />
        <StatCard label="Income" value={formatCurrency(summary.income)} helper="All income recorded" icon={ArrowUpRight} tone="emerald" />
        <StatCard label="Expenses" value={formatCurrency(summary.expenses)} helper="All expenses recorded" icon={ArrowDownRight} tone="rose" />
        <StatCard label="Savings rate" value={`${summary.savingsRate}%`} helper="Income kept after expenses" icon={PiggyBank} tone="violet" />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <ExpensePieChart data={expensesByCategory(transactions)} />
        <MonthlyLineChart data={monthlyTotals(transactions)} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-black">Recent activity</h3>
          <p className="text-sm text-slate-500">Your latest transactions</p>
        </div>
        <div className="divide-y divide-slate-100">
          {latestTransactions.map(transaction => (
            <div key={transaction.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900">{transaction.title}</p>
                <p className="text-sm text-slate-500">{transaction.category} · {transaction.date}</p>
              </div>
              <p className={`font-black ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
          {!latestTransactions.length && <p className="p-8 text-center text-slate-400">No recent transactions yet.</p>}
        </div>
      </div>
    </div>
  );
}
