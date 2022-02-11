import React from 'react';
import {
    LOGIN_FAIL,
    LOGIN_REGISTER,
    LOGIN_REGISTERED,
    LOADING_DISPLAY
} from '../constants/componentConstants'
import LoginFailed from './loginOptions/loginFailed'
import LoginRegister from './loginOptions/loginRegister'
import LoginRegistered from './loginOptions/loginRegistered'
import Loading from './Loading';

export const LoginRender = function(data, info) {


  const COMPONENT_MAP = {
    [LOGIN_FAIL]: (
      <LoginFailed
        
      />
    ),
    [LOGIN_REGISTER]: (
      <LoginRegister
        data={info}
      />
    ),
    [LOGIN_REGISTERED]: (
      <LoginRegistered
       data={info}
      />
    ),
    [LOADING_DISPLAY]: (
      <Loading />
    )
  };

  return (
    COMPONENT_MAP[data ? data : LOADING_DISPLAY ]
  );
}