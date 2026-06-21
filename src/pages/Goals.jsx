import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { CalendarDays, CheckCircle2, PiggyBank, Save, Target, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { formatCurrency } from '../utils/finance';

export default function Goals() {
  const { user } = useAuth();

  const [goalAmount, setGoalAmount] = useState('');
  const [alreadySaved, setAlreadySaved] = useState('');
  const [months, setMonths] = useState('');
  const [loadingGoal, setLoadingGoal] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadGoal = async () => {
      if (!user) return;

      try {
        setLoadingGoal(true);

        const goalRef = doc(db, 'users', user.uid, 'goals', 'main');
        const snapshot = await getDoc(goalRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setGoalAmount(data.goalAmount ? String(data.goalAmount) : '');
          setAlreadySaved(data.alreadySaved ? String(data.alreadySaved) : '');
          setMonths(data.months ? String(data.months) : '');
        }
      } catch (error) {
        console.error('Error loading goal:', error);
      } finally {
        setLoadingGoal(false);
      }
    };

    loadGoal();
  }, [user]);

  const result = useMemo(() => {
    const goal = Number(goalAmount) || 0;
    const savedAmount = Number(alreadySaved) || 0;
    const time = Number(months) || 0;
    const remaining = Math.max(goal - savedAmount, 0);
    const monthly = time > 0 ? remaining / time : 0;
    const weekly = monthly / 4.345;
    const daily = monthly / 30.437;
    const progress = goal > 0 ? Math.min(Math.round((savedAmount / goal) * 100), 100) : 0;

    const targetDate = new Date();
    if (time > 0) targetDate.setMonth(targetDate.getMonth() + time);

    return {
      goal,
      saved: savedAmount,
      time,
      remaining,
      monthly,
      weekly,
      daily,
      progress,
      targetDate,
    };
  }, [goalAmount, alreadySaved, months]);

  const hasGoal = result.goal > 0 && result.time > 0;

  async function saveGoal() {
    if (!user) return;

    try {
      setSaving(true);
      setSaved(false);

      await setDoc(doc(db, 'users', user.uid, 'goals', 'main'), {
        goalAmount: Number(goalAmount) || 0,
        alreadySaved: Number(alreadySaved) || 0,
        months: Number(months) || 0,
        updatedAt: serverTimestamp(),
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-8 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
          <Target size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Savings goals</h1>
          <p className="text-slate-500 mt-1">Define a target and see how much you need to save.</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-7 space-y-6">
          {loadingGoal && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
              Loading your saved goal...
            </div>
          )}

          <label className="block">
            <span className="font-bold text-slate-800">Goal amount</span>
            <input
              value={goalAmount}
              onChange={e => setGoalAmount(e.target.value)}
              type="number"
              min="0"
              placeholder="Example: 5000"
              className="mt-3 w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="font-bold text-slate-800">Already saved</span>
            <input
              value={alreadySaved}
              onChange={e => setAlreadySaved(e.target.value)}
              type="number"
              min="0"
              placeholder="Example: 500"
              className="mt-3 w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="font-bold text-slate-800">Time to reach goal, in months</span>
            <input
              value={months}
              onChange={e => setMonths(e.target.value)}
              type="number"
              min="1"
              placeholder="Example: 12"
              className="mt-3 w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </label>

          <button
            type="button"
            onClick={saveGoal}
            disabled={saving || loadingGoal}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-white font-bold shadow-lg shadow-blue-500/20 transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          >
            {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
            {saving ? 'Saving...' : saved ? 'Saved goal' : 'Save Goal'}
          </button>

          {saved && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-bold text-emerald-700">
              Your goal was saved successfully.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] p-8 text-white shadow-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600">
            <p className="font-semibold opacity-90">You need to save</p>
            <h2 className="text-5xl font-black mt-4">
              {hasGoal ? formatCurrency(result.monthly) : formatCurrency(0)}
            </h2>
            <p className="mt-4 text-lg opacity-90">
              {hasGoal
                ? `per month to reach your goal in ${result.targetDate.toLocaleDateString('pt-PT', {
                    month: 'long',
                    year: 'numeric',
                  })}.`
                : 'Enter your goal amount and timeframe to calculate your plan.'}
            </p>

            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{result.progress}%</span>
              </div>
              <div className="h-4 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${result.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <GoalStat label="Remaining" value={formatCurrency(result.remaining)} icon={PiggyBank} tone="purple" />
            <GoalStat label="Weekly" value={formatCurrency(hasGoal ? result.weekly : 0)} icon={CalendarDays} tone="emerald" />
            <GoalStat label="Daily" value={formatCurrency(hasGoal ? result.daily : 0)} icon={WalletCards} tone="blue" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalStat({ label, value, icon: Icon, tone }) {
  const tones = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-slate-500 font-semibold">{label}</p>
        <h3 className="text-2xl font-black mt-2 text-slate-950">{value}</h3>
      </div>
      <div className={`h-12 w-12 rounded-2xl grid place-items-center border ${tones[tone]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
