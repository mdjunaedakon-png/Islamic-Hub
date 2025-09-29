'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, Search, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Admin { id: string; role: 'admin'|'user'; }
interface Question { _id: string; text: string; answer?: string; status: 'pending'|'answered'; user?: { name: string }; createdAt: string; }

export default function AdminQuestionsPage() {
  const [me, setMe] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [answerMap, setAnswerMap] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (me?.role === 'admin') fetchQuestions();
  }, [me]);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setMe(data.user);
        if (data.user.role !== 'admin') {
          router.push('/');
          toast.error('Admin access required');
        }
      } else {
        router.push('/auth/login');
      }
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?limit=200');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch {
      toast.error('Failed to load questions');
    }
  };

  const submitAnswer = async (id: string) => {
    try {
      const answer = answerMap[id]?.trim();
      if (!answer) return;
      const res = await fetch(`/api/questions/${id}/answer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer }) });
      if (res.ok) {
        toast.success('Answer posted');
        setAnswerMap((m) => ({ ...m, [id]: '' }));
        fetchQuestions();
      } else {
        const e = await res.json().catch(()=>({}));
        toast.error(e.error || 'Failed to post answer');
      }
    } catch {
      toast.error('Failed to post answer');
    }
  };

  const filtered = questions.filter(q => {
    const t = searchTerm.toLowerCase();
    return q.text.toLowerCase().includes(t) || (q.answer || '').toLowerCase().includes(t);
  });

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary-600" />
                Manage Questions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Answer user questions. Answers are visible to everyone.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search..." className="input-field pl-9" />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((q) => (
            <div key={q._id} className="card p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{new Date(q.createdAt).toLocaleString()}</div>
              <p className="text-gray-900 dark:text-white mb-3">{q.text}</p>
              {q.status === 'answered' && (
                <div className="border-l-4 border-primary-300 dark:border-primary-700 pl-3 mb-3">
                  <p className="text-gray-700 dark:text-gray-300">{q.answer}</p>
                </div>
              )}

              <div className="flex items-start gap-2">
                <textarea value={answerMap[q._id] || ''} onChange={(e)=>setAnswerMap(m=>({ ...m, [q._id]: e.target.value }))} rows={2} placeholder="Type answer..." className="input-field flex-1" />
                <button onClick={()=>submitAnswer(q._id)} className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" />Send</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
