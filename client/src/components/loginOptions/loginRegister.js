import React from "react";
import {Link, useNavigate} from 'react-router-dom';

export default function LoginRegister({data}) {

  const navigate = useNavigate();

  const toHome=()=>{
    navigate('/sign-up',{state:{data: data}});
      }

  return (
    <div>
      <h1>Logged in, please register</h1>
      <button type="button" className="btn btn-primary btn-block" onClick={() => toHome()}>Go to Registration</button>
      <Link to="/home" className="btn btn-secondary">Exit</Link>
    </div>
  );
}