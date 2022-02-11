const {
    LOGIN_CONSENT_RESPONSE_VDXF_KEY,
    LoginConsentResponse,
} = require("verus-typescript-primitives");
const { verifyMessage } = require("./nodeCalls");
const {
    SIGNATURE_OK,
    SIGNATURE_INVALID,
} = require("../constants/componentConstants");

const checkLogin = async (queryString) => {
    let loginConsentResponse = null;

    try {
        const urlParams = new URLSearchParams(queryString.challenge);

        const reply = urlParams.get(LOGIN_CONSENT_RESPONSE_VDXF_KEY.vdxfid);

        let buff = Buffer.from(reply, "base64");
        loginConsentResponse = new LoginConsentResponse(
            JSON.parse(buff.toString())
        );

      //  console.log("loginConsentResponse", loginConsentResponse);

        const params = [
            loginConsentResponse.signing_id,
            loginConsentResponse.signature?.signature,
            loginConsentResponse.getSignedData(),
        ];

        const result = await verifyMessage(params);

        if (result) return { result: SIGNATURE_OK, data: loginConsentResponse };
        else return { result: SIGNATURE_INVALID, data: null };
    } catch (e) {
        console.log(e);
        return { result: SIGNATURE_INVALID, data: null };
    }
};

module.exports = { checkLogin };
