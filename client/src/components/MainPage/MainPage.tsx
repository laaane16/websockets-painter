import { FC, useRef, useState } from 'react';
import { InputRef, Modal, Input } from 'antd';

import { useCanvasStore } from '../../store/canvasState/canvasState';
import { getSetUsername } from '../../store/canvasState/selectors/getSetUsername';

import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';

import styles from './MainPage.module.scss';

interface Props {
  className?: string;
}

const MainPage: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const usernameRef = useRef<InputRef>(null);
  const setUsername = useCanvasStore(getSetUsername);

  const handleBtnClick = () => {
    setIsOpen(false);
    setUsername(usernameRef.current?.input?.value || '');
  };

  return (
    <div className={`app-dark-theme ${styles.app}`}>
      <div className={styles.smallBlur}></div>
      <div className={styles.midBlur}></div>
      <div className={styles.largeBlur}></div>
      <Header />
      <main className={styles.main}>
        <Modal className={styles.modal} open={isOpen} okText="Войти" onOk={handleBtnClick}>
          <span className={styles.welcomeText}>Добро пожаловать в игровую комнату</span>
          <span className={styles.nickname}>Введите свой ник, чтобы присоединиться к игре</span>
          <Input className={styles.username} ref={usernameRef} />
        </Modal>
        <Canvas />
      </main>
    </div>
  );
};

export default MainPage;
