import React from 'react';
import { Store } from '../utils/store';
interface Props {
    getStore: () => Store;
    children?: null;
}
declare const HooksHandler: React.FC<Props>;
export default HooksHandler;
