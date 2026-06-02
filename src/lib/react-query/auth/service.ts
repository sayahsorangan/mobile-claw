import {Api} from '@lib/ky';
import {ApiResponse} from '@react-query/base-types';
import {MutationFunction} from '@tanstack/react-query';

import {SignInRequest, SignInResponse} from './types';

const signIn: MutationFunction<SignInResponse, SignInRequest> = async data => {
  const resp = await Api.post('api/auth/login', {json: data}).json<ApiResponse<SignInResponse>>();
  return resp.data;
};

export const AuthServices = {
  signIn,
};
