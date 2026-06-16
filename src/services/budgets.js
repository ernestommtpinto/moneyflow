import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function budgetsRef(userId) {
  return collection(db, 'users', userId, 'budgets');
}

export function subscribeToBudgets(userId, callback) {
  return onSnapshot(budgetsRef(userId), snapshot => {
    callback(snapshot.docs.map(docItem => ({ id: docItem.id, ...docItem.data() })));
  });
}

export function createBudget(userId, data) {
  return addDoc(budgetsRef(userId), {
    ...data,
    limit: Number(data.limit),
    createdAt: serverTimestamp(),
  });
}

export function deleteBudget(userId, budgetId) {
  return deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
}
