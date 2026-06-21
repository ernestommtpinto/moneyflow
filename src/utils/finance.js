export const categories = [
  'Salary',
  'Food',
  'Rent',
  'Transport',
  'Subscriptions',
  'Shopping',
  'Health',
  'Other',
];

export function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
  }).format(value || 0);
}

export function getMonthKey(dateString) {
  return dateString?.slice(0, 7);
}

export function calculateSummary(transactions) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate: income ? Math.round(((income - expenses) / income) * 100) : 0,
  };
}

export function expensesByCategory(transactions) {
  const result = {};

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      result[transaction.category] =
        (result[transaction.category] || 0) + Number(transaction.amount);
    });

  return Object.entries(result).map(([category, amount]) => ({
    category,
    amount,
  }));
}

export function monthlyTotals(transactions) {
  const result = {};

  transactions.forEach((transaction) => {
    const month = getMonthKey(transaction.date);

    if (!result[month]) {
      result[month] = {
        month,
        income: 0,
        expenses: 0,
      };
    }

    if (transaction.type === 'income') {
      result[month].income += Number(transaction.amount);
    }

    if (transaction.type === 'expense') {
      result[month].expenses += Number(transaction.amount);
    }
  });

  return Object.values(result).sort((a, b) => a.month.localeCompare(b.month));
}

export function exportTransactionsCsv(transactions) {
  const headers = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Notes'];

  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.type,
    transaction.title,
    transaction.category,
    transaction.amount,
    transaction.notes || '',
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'moneyflow-transactions.csv';
  link.click();

  URL.revokeObjectURL(url);
}
