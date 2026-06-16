import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, loginWithGoogle } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">MoneyFlow</h1>
          <p className="text-slate-500 mt-2">Track income, expenses, budgets and insights.</p>
        </div>
        <button
          onClick={loginWithGoogle}
          className="w-full bg-slate-950 text-white py-3 rounded-xl hover:bg-slate-800"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
