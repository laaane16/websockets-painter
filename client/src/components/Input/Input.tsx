import { FC, InputHTMLAttributes, RefObject } from 'react';

import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  ref?: RefObject<HTMLInputElement | null>;
}

const Input: FC<Props> = ({ type = 'text', className, ref = null, ...otherProps }) => {
  return <input ref={ref} className={`${className} ${styles.input}`} type={type} {...otherProps} />;
};

export default Input;
