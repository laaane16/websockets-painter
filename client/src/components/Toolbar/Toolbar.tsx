import { FC } from 'react';
import { message } from 'antd';

import Container from '../Container/Container';

import styles from './Toolbar.module.scss';
import CanvasTools from './CanvasTools';
import AppTools from './AppTools';

interface Props {
  className?: string;
}

const Toolbar: FC<Props> = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className={styles.toolbar}>
      <Container className={styles.toolbarContent}>
        {contextHolder}
        <CanvasTools />
        <AppTools messageApi={messageApi} />
      </Container>
    </div>
  );
};

export default Toolbar;
