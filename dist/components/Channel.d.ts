import React from 'react';
import { Store } from '../utils/store';
declare const Channel: React.FC<{
    id: string;
    getStore: () => Store;
    name: string;
}>;
export default Channel;
