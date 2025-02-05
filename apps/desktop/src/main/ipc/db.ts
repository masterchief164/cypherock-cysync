import { initializeAndGetDb } from '../utils';
import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

const dbMethodList = async () =>
  getMethodListFromObject(initializeAndGetDb(), 2);

const dbMethodCall = async (method: string, ...args: any[]) =>
  callMethodOnObject(initializeAndGetDb(), method, ...args);

export const getDbIPCHandlers = () => [
  {
    name: ipcConfig.methods.dbMethodCall,
    func: dbMethodCall,
  },
  {
    name: ipcConfig.methods.dbMethodList,
    func: dbMethodList,
  },
];
