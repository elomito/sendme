import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Package, Truck, CheckCircle2, User, Clock, Banknote, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  currentUsername: string;
  key?: string | number;
}

export function TaskCard({ task, currentUserId, currentUsername }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isRequester = task.requesterId === currentUserId;
  const isRunner = task.runnerId === currentUserId;

  const handleClaim = async () => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        runnerId: currentUserId,
        runnerName: currentUsername,
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${task.id}`);
    }
  };

  const handleDeliver = async () => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        status: 'delivered',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${task.id}`);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
  };

  const statusIcons = {
    pending: <Clock className="w-3.5 h-3.5" />,
    accepted: <Truck className="w-3.5 h-3.5" />,
    delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
      id={`task-${task.id}`}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 5, x: '-50%' }}
            className="absolute bottom-full left-1/2 mb-3 w-72 bg-zinc-900 text-white p-5 rounded-2xl shadow-2xl z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800">
              <Info className="w-4 h-4 text-brand" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Detailed Manifest</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-bold mb-0.5">Requester</span>
                <p className="text-sm font-medium">{task.requesterName}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 block font-bold mb-0.5">Item Requested</span>
                <p className="text-sm border-l-2 border-brand pl-2 italic">"{task.itemName}"</p>
              </div>

              {task.notes && (
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block font-bold mb-0.5">Special Instructions</span>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed bg-zinc-800/50 p-2 rounded-lg">
                    {task.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block font-bold mb-0.5">Runner Fee</span>
                  <p className="text-sm font-bold text-brand">KES {task.commission}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-zinc-500 block font-bold mb-0.5">Total Payload</span>
                  <p className="text-sm font-bold">KES {task.totalPrice}</p>
                </div>
              </div>
            </div>

            {/* Tip of the tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border flex items-center gap-1.5 ${statusColors[task.status]}`}>
              {statusIcons[task.status]}
              {task.status}
            </div>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <User className="w-4 h-4" />
            <span className="text-xs font-medium">{task.requesterName}</span>
            {isRequester && <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-md ml-1">You</span>}
          </div>
        </div>

        <h3 className="text-lg font-bold text-zinc-900 mb-1 flex items-center gap-2">
          <Package className="w-5 h-5 text-zinc-400" />
          {task.itemName}
        </h3>
        
        {task.notes && (
          <p className="text-sm text-zinc-500 mb-4 bg-zinc-50 p-2 rounded-lg border border-dashed border-zinc-200 italic font-mono">
            "{task.notes}"
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-zinc-100">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block mb-1">Commission</span>
            <div className="flex items-center gap-1 text-brand font-bold">
              <Banknote className="w-4 h-4" />
              <span>KES {task.commission}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block mb-1">Total Payout</span>
            <div className="text-zinc-900 font-bold">
              KES {task.totalPrice}
            </div>
          </div>
        </div>

        {task.status === 'pending' && !isRequester && (
          <button
            onClick={handleClaim}
            className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Claim Task
          </button>
        )}

        {task.status === 'accepted' && isRunner && (
          <button
            onClick={handleDeliver}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Mark as Delivered
          </button>
        )}

        {task.status === 'accepted' && !isRunner && (
          <div className="w-full bg-blue-50/50 border border-blue-100 text-blue-700 py-3 rounded-xl font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-default px-4 text-center">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Accepted by <span className="font-bold underline decoration-blue-200 decoration-2 underline-offset-2">{task.runnerName}</span></span>
            </div>
            <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mt-0.5">
              {isRequester ? "Great news! Your runner is on the way with your item" : "This quest has been claimed by another runner"}
            </p>
          </div>
        )}

        {task.status === 'delivered' && (
          <div className="w-full bg-green-50 text-green-600 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-default border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            Order Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}
