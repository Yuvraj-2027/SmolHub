import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

function ConfirmationModal({ isOpen, onClose, email }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="mb-4 text-5xl">✉️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p className="text-gray-300 mb-4">
            We've sent a confirmation link to:
          </p>
          <p className="text-blue-400 font-medium mb-6">{email}</p>
          <p className="text-sm text-gray-400">
            Click the link in the email to verify your account. If you don't see it, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;