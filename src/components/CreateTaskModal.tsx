import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, Package, Banknote, ClipboardList, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
}

export function CreateTaskModal({ isOpen, onClose, userId, username }: CreateTaskModalProps) {
  const [itemName, setItemName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COMMISSION = 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const price = parseFloat(basePrice);
      const taskData = {
        itemName,
        basePrice: price,
        commission: COMMISSION,
        totalPrice: price + COMMISSION,
        notes,
        requesterId: userId,
        requesterName: username,
        runnerId: null,
        runnerName: null,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'tasks'), taskData);
      onClose();
      setItemName('');
      setBasePrice('');
      setNotes('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand" />
                New Request
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                    <Package className="w-4 h-4 text-zinc-400" />
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Double cheeseburger, Notebook"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                      <Banknote className="w-4 h-4 text-zinc-400" />
                      Estimated Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-mono">KES</span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-14 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2 opacity-50">
                      Commission
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 font-mono text-sm flex items-center">
                      KES {COMMISSION}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2">
                    <ClipboardList className="w-4 h-4 text-zinc-400" />
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., No onions, call before buying..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-mono text-sm resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-medium px-1 bg-red-50 py-2 rounded-lg border border-red-100 italic">
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="text-sm font-medium text-zinc-500">
                  Total: <span className="text-zinc-900 font-bold">KES {parseFloat(basePrice || '0') + COMMISSION}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Post Request'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
