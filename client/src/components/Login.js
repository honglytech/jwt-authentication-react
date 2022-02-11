import React, { Component, useEffect } from "react";
import AuthService from "../services/auth.service";
import {LoginRender} from "./loginOptions.render";

import {
  LOGIN_REGISTER,
  LOGIN_REGISTERED,
  LOADING_DISPLAY
} from '../constants/componentConstants'

const VerifyLogin = () => {
  
  const [userData, setUserData] = React.useState(LOADING_DISPLAY);


  useEffect(async () => {
   
    const queryString = window.location.search;
    //console.log("query",queryString);
    const tokenDetails = await AuthService.checkLoginChallenge(queryString);

    if(tokenDetails.registered)
      setUserData(LOGIN_REGISTERED);
    else
      setUserData(LOGIN_REGISTER);

  }, []);
 
return LoginRender(userData);
};

export default VerifyLogin;


/*
const checkRegistered = async (data) => {
  console.log("signature Result: ", data);

  const userFound = await checkUser(data.signing_id);
  console.log("User found?: ", userFound);
  this.setState({ userData: data });

  if (userFound) this.setState({ loginOption: LOGIN_REGISTERED });
  else this.setState({ loginOption: LOGIN_REGISTER });
};

const checkLoginChallenge = async () => {
  const { result, data } = await checkLogin();
  if (result == SIGNATURE_INVALID) {
    this.setState({ loginOption: LOGIN_FAIL });
    return;
  }

  await checkRegistered(data);
};*/