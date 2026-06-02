import {useMQ, UseMQOptions} from '@react-query/custom-hooks';

import {AuthQueryKey} from './keys';
import {AuthServices} from './service';
import {SignInRequest, SignInResponse} from './types';

function useSignIn(options?: UseMQOptions<SignInResponse, SignInRequest>) {
  return useMQ([AuthQueryKey.signIn], AuthServices.signIn, options);
}

export const AuthQueries = {
  useSignIn,
};
