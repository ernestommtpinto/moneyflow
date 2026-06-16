import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export function transactionsRef(userId) {
  return collection(db, 'users', userId, 'transactions');
}

export function subscribeToTransactions(userId, callback) {
  const q = query(transactionsRef(userId), orderBy('date', 'desc'));
  return onSnapshot(q, snapshot => {
    const transactions = snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data(),
    }));
    callback(transactions);
  });
}

export function createTransaction(userId, data) {
  return addDoc(transactionsRef(userId), {
    ...data,
    amount: Number(data.amount),
    createdAt: serverTimestamp(),
  });
}

export function updateTransaction(userId, transactionId, data) {
  return updateDoc(doc(db, 'users', userId, 'transactions', transactionId), {
    ...data,
    amount: Number(data.amount),
  });
}

export function deleteTransaction(userId, transactionId) {
  return deleteDoc(doc(db, 'users', userId, 'transactions', transactionId));
}
