import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';

import styles from './App.module.scss';
import Modal from './components/Modal/Modal';
import { useStore } from './store/canvasState';
import { Brush } from './tools/Brush';

const App: FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const setUsername = useStore((state) => state.setUsername);
  const canvas = useStore((state) => state.canvas);

  const handleBtnClick = () => {
    setIsOpen(false);
    setUsername(usernameRef.current?.value || '');
  };

  return (
    <Routes>
      <Route
        path="/:id"
        element={
          <div className={styles.app}>
            <Header />
            <main className={styles.main}>
              <Modal
                content={
                  <div style={{ width: '300px', height: '300px' }}>
                    <input ref={usernameRef} type="text" />
                    <button onClick={handleBtnClick}>Войти</button>
                  </div>
                }
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
              />
              <Canvas />
            </main>
          </div>
        }
      />
      <Route path="*" element={<Navigate to={`/${(+new Date()).toString(16)}`} />} />
    </Routes>
  );
};

export default App;
