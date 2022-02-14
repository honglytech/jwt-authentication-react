const { Client } = require('verus-typescript-primitives/dist/vdxf/classes/Client');
const {LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY, LOGIN_CONSENT_REDIRECT_VDXF_KEY, VerusIDSignature, LoginConsentRequest}  = require('verus-typescript-primitives');
const { Challenge } = require('verus-typescript-primitives/dist/vdxf/classes/Challenge');
const deep = require("./deepLink");
const { signMessage } = require("./nodeCalls");
const jwt = require("jsonwebtoken");

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const verusLogin = async () => {
   
    const challengeClient = new Client({
        client_id: 'verus-login-consent',
        name: 'Fancy Client Name',
        //@ts-ignore
        redirect_uris: ["http://localhost:3000/login?"].map(uri => ({type: LOGIN_CONSENT_REDIRECT_VDXF_KEY.vdxfid, uri})),
    })

    const uuid = uuidv4();

    const token = jwt.sign(   
        { uuid: uuid },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

    const challengeParams  = {
        uuid: uuid,
        request_url:"",
        login_challenge: token,
        requested_scope: ["i7TBEho8TUPg4ESPmGRiiDMGF55QJM37Xk"], 
        client: challengeClient
    }

    const loginConsentChallenge = new Challenge(challengeParams);

    console.log("message to be signed: ", loginConsentChallenge.toString());
    const result = await signMessage(loginConsentChallenge);

    //let buff = loginConsentChallenge.toString();
   // console.log("buff", buff);

    const signature = result; 
    
    const verusIdSignature = new VerusIDSignature({signature
    }, LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);

    const loginConsentRequest = new LoginConsentRequest({
        chain_id: "VRSCTEST",
        signing_id: 'verus-login-consent@',
        signature: verusIdSignature,
        challenge: loginConsentChallenge,
    });

    const walletRedirectUrl = deep(loginConsentRequest);
    console.log("walletRedirectUrl:\n", walletRedirectUrl);
    
    return walletRedirectUrl;
    //window.location.assign(walletRedirectUrl);
  
};

module.exports = verusLogin ;