import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 min-w-[300px] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute cursor-pointer top-2 right-2 text-2xl text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
