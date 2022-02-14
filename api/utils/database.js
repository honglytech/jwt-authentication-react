const Axios = require("axios");
const { Client } = require("pg");

var client = new Client({
  user: "verus",
  password: "password",
  database: "verus",
  host: "192.168.1.121",
  port: 5432,
});

client.connect();

exports.checkUser = async (userid) => {
  try {
    const arrayout = [];

    const queryresult = await client.query("SELECT * FROM users");

    // console.log("res",queryresult.rows);
    const data = queryresult.rows;

    data.forEach((row) => {
      arrayout.push(row.username);
    });

    const present = arrayout.includes(userid);

    return present;
  } catch (e) {
    console.log(e);
    return false;
  }
};

exports.userInfo = async (username) => {
  try {
    const userDetails = await Axios.post("http://localhost:3001/userdetails", {
      username: username,
    });
    console.log("userDetails: ", userDetails);

    return userDetails;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.signMessage = async (loginConsentChallenge) => {
  Axios.defaults.withCredentials = true;
  try {
    const result = await Axios.post("http://localhost:3001/signmessage", {
      params: loginConsentChallenge.toString(),
    }).then((response) => {
      // console.log("Reply from verus sign message: ",response.data.signature);
      return response.data.signature;
    });

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.verifyMessage = async (params) => {
  Axios.defaults.withCredentials = true;
  try {
    const result = await Axios.post("http://localhost:3001/verifymessage", {
      params: JSON.stringify(params),
    }).then((response) => {
      //  console.log("Reply from verus check signed message: ",response.data.signaturevalid);
      return response.data.signaturevalid;
    });

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.getIdentity = async (identity) => {
  Axios.defaults.withCredentials = true;
  try {
    const result = await Axios.post("http://localhost:3001/getidentity", {
      params: identity,
    });

    return result.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.obfuscateDocument = async (doc) => {
  Axios.defaults.withCredentials = true;
  try {
    const result = await Axios.post("http://localhost:3001/obfuscatedocument", {
      params: JSON.stringify(doc),
    });

    return result.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
