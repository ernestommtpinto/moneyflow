import { useEffect, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import { useAuth } from '../context/AuthContext';
import { createTransaction, deleteTransaction, subscribeToTransactions } from '../services/transactions';
import { exportTransactionsCsv } from '../utils/finance';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => subscribeToTransactions(user.uid, setTransactions), [user.uid]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-slate-500">Add, view and export your records.</p>
        </div>
        <button onClick={() => exportTransactionsCsv(transactions)} className="px-4 py-2 rounded-xl bg-white border hover:bg-slate-50">
          Export CSV
        </button>
      </div>
      <TransactionForm onSubmit={data => createTransaction(user.uid, data)} />
      <TransactionTable transactions={transactions} onDelete={id => deleteTransaction(user.uid, id)} />
    </div>
  );
}
