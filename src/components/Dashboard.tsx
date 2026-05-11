import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { signOut } from 'firebase/auth';
import { 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

export function Dashboard() {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'my-requests' | 'my-runs'>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch all tasks and sort by createdAt
    // We filter client-side for the MVP to avoid composite index requirements
    const q = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];

      // Apply client-side filtering based on activeTab
      let filtered: Task[] = [];
      if (activeTab === 'feed') {
        filtered = taskData.filter(t => t.status === 'pending');
      } else if (activeTab === 'my-requests') {
        filtered = taskData.filter(t => t.requesterId === user.uid);
      } else {
        filtered = taskData.filter(t => t.runnerId === user.uid);
      }

      setTasks(filtered);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, activeTab]);

  const handleLogout = () => signOut(auth);

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    accepted: tasks.filter(t => t.status === 'accepted').length,
    delivered: tasks.filter(t => t.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold italic shadow-lg shadow-brand/20">
              SM
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">SENDME</h1>
              <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Cluster Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-zinc-900">{profile?.username || user?.displayName}</p>
              <p className="text-[10px] text-zinc-400 font-mono">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Welcome & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
              Hey {profile?.username || 'there'}, <br/>
              <span className="text-brand">Got an errand?</span>
            </h2>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-brand text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand/30 transition-all"
          >
            <Plus className="w-6 h-6" />
            Request New Item
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-200/50 p-1 rounded-2xl mb-8 w-fit mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'feed' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Task Feed
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'my-requests' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Package className="w-4 h-4" />
            My Requests
          </button>
          <button
            onClick={() => setActiveTab('my-runs')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'my-runs' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Truck className="w-4 h-4" />
            Active Runs
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full"
            />
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  currentUserId={user!.uid} 
                  currentUsername={profile?.username || user!.displayName || 'User'} 
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-zinc-200 border-dashed"
          >
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">No tasks here yet</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">
              {activeTab === 'feed' 
                ? "The cluster is quiet. Why don't you start by posting a request?" 
                : "You haven't participated in any tasks in this category."}
            </p>
          </motion.div>
        )}
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user!.uid} 
        username={profile?.username || user!.displayName || 'User'}
      />
    </div>
  );
}
