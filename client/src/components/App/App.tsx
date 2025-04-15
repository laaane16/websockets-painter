import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../MainPage/MainPage';

interface Props {
  className?: string;
}

const App: FC<Props> = () => {
  return (
    <Routes>
      <Route path="/:id" element={<MainPage />} />
      <Route path="*" element={<Navigate to={`/${(+new Date()).toString(16)}`} />} />
    </Routes>
  );
};

export default App;
