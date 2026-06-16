export const categories = ['Salary', 'Food', 'Rent', 'Transport', 'Subscriptions', 'Shopping', 'Health', 'Other'];

export function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
  }).format(value || 0);
}

export function getMonthKey(dateString) {
  return dateString?.slice(0, 7);
}

export function calculateSummary(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate: income ? Math.round(((income - expenses) / income) * 100) : 0,
  };
}

export function expensesByCategory(transactions) {
  const result = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    result[t.category] = (result[t.category] || 0) + Number(t.amount);
  });
  return Object.entries(result).map(([category, amount]) => ({ category, amount }));
}

export function monthlyTotals(transactions) {
  const result = {};
  transactions.forEach(t => {
    const month = getMonthKey(t.date);
    if (!result[month]) result[month] = { month, income: 0, expenses: 0 };
    if (t.type === 'income') result[month].income += Number(t.amount);
    if (t.type === 'expense') result[month].expenses += Number(t.amount);
  });
  return Object.values(result).sort((a, b) => a.month.localeCompare(b.month));
}

export function exportTransactionsCsv(transactions) {
  const headers = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Notes'];
  const rows = transactions.map(t => [t.date, t.type, t.title, t.category, t.amount, t.notes || '']);
  const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'moneyflow-transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}
