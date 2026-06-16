import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">User profile and app configuration.</p>
      </div>
      <div className="bg-white border rounded-2xl p-5">
        <p><strong>Name:</strong> {user?.displayName || 'No name'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p className="mt-4 text-sm text-slate-500">Next improvement: add currency selector, dark mode and profile preferences.</p>
      </div>
    </div>
  );
}
