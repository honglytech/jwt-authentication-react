import React from "react";
import AuthService from "../services/auth.service";

const Home = () => {
  const handleLogin = async () => {
    try {
      const walletRedirectUrl = await AuthService.getChallenge();
      console.log("walletRedirectUrl", walletRedirectUrl);
      window.location.assign(walletRedirectUrl.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <h3>Sign In</h3>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => handleLogin()}
          >
            Submit
          </button>

          <p className="forgot-password text-right">
            Get <a href="https://verus.io/">Verus Wallet</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
