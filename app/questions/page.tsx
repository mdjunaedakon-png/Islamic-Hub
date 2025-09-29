'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Send, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserInfo { id: string; name: string; role: 'admin'|'user'; }
interface Question { _id: string; text: string; answer?: string; status: 'pending'|'answered'; user?: { name: string }; createdAt: string; }

export default function QuestionsPage() {
  const [me, setMe] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMe();
    fetchQuestions();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setMe(data.user);
      }
    } catch {}
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?limit=100');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    try {
      const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (res.ok) {
        setText('');
        await fetchQuestions();
        toast.success('Question submitted');
      } else if (res.status === 401) {
        toast.error('Please login to ask a question');
      } else {
        const e = await res.json().catch(()=>({}));
        toast.error(e.error || 'Failed to submit');
      }
    } catch {
      toast.error('Failed to submit');
    }
  };

  const filtered = questions.filter(q => {
    const t = searchTerm.toLowerCase();
    return q.text.toLowerCase().includes(t) || (q.answer || '').toLowerCase().includes(t);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary-600" />
                Community Questions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Ask your question; only admins can answer. Everyone can read.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ask box */}
        <div className="card p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} placeholder={me ? 'Type your question...' : 'Login to ask a question'} className="w-full input-field resize-none" />
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{text.trim().length}/500</span>
                <button onClick={submitQuestion} disabled={!text.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search questions or answers..." className="input-field pl-9" />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_,i)=> (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((q) => (
              <div key={q._id} className="card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Asked by <span className="font-medium text-gray-700 dark:text-gray-300">{q.user?.name || 'User'}</span></div>
                  <div className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</div>
                </div>
                <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">{q.text}</p>
                {q.status === 'answered' ? (
                  <div className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50/60 dark:bg-primary-900/20 p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Answered by Admin</div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{q.answer}</p>
                  </div>
                ) : (
                  <span className="inline-flex text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending answer</span>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">No questions found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
