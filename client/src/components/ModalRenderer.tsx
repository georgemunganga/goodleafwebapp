import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { ButtonLoader } from './ui/loading-spinner';
import { ModalConfig, useModal } from '@/contexts/ModalContext';

/**
 * Confirm Modal Component
 */
function ConfirmModal({
  modal,
  onClose,
}: {
  modal: ModalConfig;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (modal.onConfirm) {
        await modal.onConfirm();
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (modal.onCancel) {
      modal.onCancel();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <h2 className="text-lg font-semibold text-gray-900">{modal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {modal.message && (
          <p className="text-gray-600 text-sm leading-relaxed">{modal.message}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {modal.cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${
              modal.isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#2e7146] hover:bg-[#1d4a2f] text-white'
            }`}
          >
            {isLoading ? (
              <ButtonLoader isLoading={true}>
                {modal.confirmText || 'Confirm'}
              </ButtonLoader>
            ) : (
              modal.confirmText || 'Confirm'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Alert Modal Component
 */
function AlertModal({
  modal,
  onClose,
}: {
  modal: ModalConfig;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (modal.onConfirm) {
        await modal.onConfirm();
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <h2 className="text-lg font-semibold text-gray-900">{modal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {modal.message && (
          <p className="text-gray-600 text-sm leading-relaxed">{modal.message}</p>
        )}

        {/* Action */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-[#2e7146] hover:bg-[#1d4a2f] text-white"
          >
            {isLoading ? (
              <ButtonLoader isLoading={true}>
                {modal.confirmText || 'OK'}
              </ButtonLoader>
            ) : (
              modal.confirmText || 'OK'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Terms Modal Component
 */
function TermsModal({
  modal,
  onClose,
}: {
  modal: ModalConfig;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (modal.onConfirm) {
        await modal.onConfirm();
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (modal.onCancel) {
      modal.onCancel();
    }
    onClose();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtEnd =
      element.scrollHeight - element.scrollTop - element.clientHeight < 10;
    setIsScrolledToEnd(isAtEnd);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{modal.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {modal.content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 space-y-3">
          {!isScrolledToEnd && (
            <p className="text-xs text-gray-500 text-center">
              Scroll to the end to agree
            </p>
          )}
          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              {modal.cancelText || 'Decline'}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || !isScrolledToEnd}
              className="flex-1 bg-[#2e7146] hover:bg-[#1d4a2f] text-white"
            >
              {isLoading ? (
                <ButtonLoader isLoading={true}>
                  {modal.confirmText || 'I Agree'}
                </ButtonLoader>
              ) : (
                modal.confirmText || 'I Agree'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal Renderer Component
 * Renders all modals from the ModalContext
 */
export function ModalRenderer() {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map((modal) => (
        <div key={modal.id}>
          {modal.type === 'confirm' && (
            <ConfirmModal
              modal={modal}
              onClose={() => closeModal(modal.id)}
            />
          )}
          {modal.type === 'alert' && (
            <AlertModal
              modal={modal}
              onClose={() => closeModal(modal.id)}
            />
          )}
          {modal.type === 'terms' && (
            <TermsModal
              modal={modal}
              onClose={() => closeModal(modal.id)}
            />
          )}
          {modal.type === 'custom' && modal.children && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
                <button
                  onClick={() => closeModal(modal.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                {modal.children}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
