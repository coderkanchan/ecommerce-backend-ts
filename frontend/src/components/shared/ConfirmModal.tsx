"use client";
import { AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
      <div className="bg-[#111] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
            <AlertCircle size={30} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition text-gray-500">
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed mb-8">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete Now"}
          </button>
        </div>
      </div>
    </div>
  );
}