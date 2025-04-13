import { FC, ReactNode, useEffect, useState, memo } from 'react';
import cn from 'classnames';

import styles from './Modal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  content: ReactNode;
  onClose: () => void;
  delay?: number;
}

interface UseModalProps {
  isOpen: boolean;
  delay?: number;
  onClose: () => void;
}

const useModal = ({ isOpen, delay = 300, onClose }: UseModalProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, delay);
  };

  return { visible, handleClose };
};

const Modal: FC<Props> = ({ isOpen, content, delay, onClose, className }) => {
  const { visible, handleClose } = useModal({ isOpen, delay, onClose });

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={cn(styles.overlay, { [styles.visible]: visible })}
        onClick={handleClose}
      ></div>
      <div className={cn(styles.modal, className, { [styles.visible]: visible })}>{content}</div>
    </>
  );
};

export default memo(Modal);
