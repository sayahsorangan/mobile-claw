import {combineReducers} from 'redux';

import {AppReducer} from './slice/app';
import {DiagnosticReducer} from './slice/diagnostic';
import {OnboardingReducer} from './slice/onboarding';
import {UserReducer} from './slice/user';

const baseReducer = {
  UserReducer,
  AppReducer,
  OnboardingReducer,
  DiagnosticReducer,
};

const orderedReducer = Object.keys(baseReducer)
  .sort()
  .reduce((acc, item) => {
    acc[item] = baseReducer[item];
    return acc;
  }, {}) as typeof baseReducer;

export const rootReducers = combineReducers(orderedReducer);
