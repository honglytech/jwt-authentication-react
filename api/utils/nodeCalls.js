const axios = require('axios');
const { Client } = require('pg');

var client = new Client({
    user: 'verus',
    password: 'password',
    database: 'verus',
    host: 'localhost',
    port: 5432
  });
client.connect();

axios.defaults.withCredentials = true;

const vrsctest = axios.create({
    baseURL: "http://localhost:20656/" , //process.env.VRSCTEST_RPC_URL,
    auth: {
        username: "verusdesktop" , //process.env.VRSCTEST_RPC_USER || '',
        password: "6bVvhDKGvrP5WqBNOk8mWlsqxQTly7ER7IE7_WjzhYk", // process.env.VRSCTEST_RPC_PASSWORD || '',
    }
});

const verusClient = {
    vrsctest,
    // add more verus pbaas chain clients here
}

const checkUser = async (userid) => {
    const arrayout = [];
    client.query("SELECT * FROM users").then(result => {
  
    console.log("res",result.rows);
    const data = result.rows;
  
    console.log('all data');
    data.forEach(row => {
    arrayout.push(row.username);
      })
      return arrayout;
    }).catch(err => {
      console.log(err.stack);
    });

   }
   
const userInfo = async (username) => {
  
    client.query(`SELECT * FROM users WHERE username = '${username}'`).then(result => {
  
     // console.log("res",result.rows[0]);
  
      return result.rows[0];
      }).catch(err => {
          console.log(err.stack);
      });
    }
   
const signMessage = async (loginConsentChallenge) => {
  // console.log("req.query",req.body.params);
  // console.log("loginConsentChallenge: ", loginConsentChallenge);
  try{
   const daemonReply =  await verusClient['vrsctest'].post('', {
      jsonrpc: '2.0',
      method: 'signmessage',
      params: [
          "verus-login-consent@",   //ID that you hold to sign your websites outgoing messages
          loginConsentChallenge.toString()
      ]})
      if(daemonReply.data?.result)
        return daemonReply.data.result.signature;

    }catch(e){
      console.log(e)
      return { signature: false, error: e.message };
    }

}
   
const verifyMessage = async (loginConsentResponse) => {

  try{
    const daemonReply =  await verusClient['vrsctest'].post('', {
       jsonrpc: '2.0',
       method: 'verifymessage',
       params: [
       loginConsentResponse[0],
       loginConsentResponse[1],
       loginConsentResponse[2]
   ]})
       if(daemonReply.data?.result)
         return daemonReply.data.result;
 
     }catch(e){
       console.log(e)
       return { signature: false, error: e.message };
     }
 
}
   
const getIdentity = async (identity) => {

  try{
    const daemonReply =  await verusClient['vrsctest'].post('', {
       jsonrpc: '2.0',
       method: 'getidentity',
       params: [
                  identity
               ]})
       if(daemonReply.data?.result)
         return daemonReply.data.result;
 
     }catch(e){
       console.log(e)
       return { signature: false, error: e.message };
     }
      
}

module.exports = {checkUser, userInfo, signMessage, verifyMessage, getIdentity }