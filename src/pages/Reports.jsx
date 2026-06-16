import { useEffect, useState } from 'react';
import ExpensePieChart from '../components/ExpensePieChart';
import MonthlyLineChart from '../components/MonthlyLineChart';
import { useAuth } from '../context/AuthContext';
import { subscribeToTransactions } from '../services/transactions';
import { expensesByCategory, monthlyTotals } from '../utils/finance';

export default function Reports() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => subscribeToTransactions(user.uid, setTransactions), [user.uid]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-slate-500">Visual insights from your financial data.</p>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <ExpensePieChart data={expensesByCategory(transactions)} />
        <MonthlyLineChart data={monthlyTotals(transactions)} />
      </div>
    </div>
  );
}
