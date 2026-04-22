"use client";
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }: Props) {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
      <div
        className="bg-[#0A0A0A] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
            <AlertCircle size={30} />
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-900 rounded-full transition-colors text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 uppercase tracking-tighter italic">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed mb-10 text-sm sm:text-base font-medium">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest order-2 sm:order-1"
          >
            Abort Mission
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase text-xs tracking-widest order-1 sm:order-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Confirm Purge"}
          </button>
        </div>
      </div>
    </div>
  );
}