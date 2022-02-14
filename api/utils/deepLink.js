
const {WALLET_VDXF_KEY, LOGIN_CONSENT_REQUEST_VDXF_KEY} = require('verus-typescript-primitives');

/**
 * Authenticates a seed for eth and electrum modes. Returns true on success, throws
 * error on failiure
 * @param {String} seed Seed to authenticate with
 */
const desktopWalletLogin = (data) => {
    console.log("data: ",data.toString());

    let buff = Buffer.from(data.toString());
    let base64data = buff.toString('base64');
  //  console.log("base64data: ",base64data);

   return `${WALLET_VDXF_KEY.vdxfid}://x-callback-url/${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}/?${LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid}=${base64data}`
};

module.exports = desktopWalletLogin;