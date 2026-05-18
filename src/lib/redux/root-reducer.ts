import {combineReducers} from 'redux';

import {AppReducer} from './slice/app';
import {LlmReducer} from './slice/llm';
import {MemoryReducer} from './slice/memory';
import {NotificationReducer} from './slice/notification';
import {RagReducer} from './slice/rag';
import {UserReducer} from './slice/user';

const baseReducer = {
  UserReducer,
  AppReducer,
  LlmReducer,
  MemoryReducer,
  RagReducer,
  NotificationReducer,
};

const orderedReducer = Object.keys(baseReducer)
  .sort()
  .reduce((acc, item) => {
    acc[item] = baseReducer[item];
    return acc;
  }, {}) as typeof baseReducer;

export const rootReducers = combineReducers(orderedReducer);
