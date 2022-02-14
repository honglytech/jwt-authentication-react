import {LOGIN_CONSENT_RESPONSE_VDXF_KEY, LoginConsentResponse} from 'verus-typescript-primitives';
import {Buffer} from 'buffer';
import Axios from "axios";
import {
    SIGNATURE_OK,
    SIGNATURE_INVALID
} from '../constants/componentConstants'
import {verifyMessage} from "../utils/database";

/**
 * Authenticates a seed for eth and electrum modes. Returns true on success, throws
 * error on failiure
 * @param {String} seed Seed to authenticate with
 */
export const checkLogin = async () => {
  
    let loginConsentResponse = null;

    try{
    const queryString = window.location.search;
    // console.log("queryString",queryString);
     const urlParams = new URLSearchParams(queryString);
     
     const reply = urlParams.get(LOGIN_CONSENT_RESPONSE_VDXF_KEY.vdxfid)

     let buff = new Buffer(reply, 'base64');
     loginConsentResponse = new LoginConsentResponse(JSON.parse(buff.toString()));

    // console.log("loginConsentResponse",loginConsentResponse);

     const params = [loginConsentResponse.signing_id,
                     loginConsentResponse.signature?.signature,
                     loginConsentResponse.getSignedData()];

     const result = await verifyMessage(params);

      if(result)
        return {result: SIGNATURE_OK, data: loginConsentResponse};
      else
        return {result: SIGNATURE_INVALID, data: null};
    
    }
    catch(e){
       
        console.log(e);
        return {result: SIGNATURE_INVALID, data: null};
    
    }
        
};