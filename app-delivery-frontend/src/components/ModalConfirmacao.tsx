import React from 'react';
import styles from './ModalConfirmacao.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalConfirmacao({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.actions}>
          <button onClick={onConfirm} className={`${styles.button} ${styles.confirmButton}`}>
            Esvaziar e adicionar
          </button>
          <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
