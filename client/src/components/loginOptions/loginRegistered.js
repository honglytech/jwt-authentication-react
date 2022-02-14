import React from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginRegistered({ data }) {

  const navigate = useNavigate();

  const toAttestation = () => {
    navigate('/viewattestation', { state: { data: data } });
  }

  return (
    <div>
      <h1>Logged in and you are registered</h1>
      <button type="button" className="btn btn-primary btn-block" onClick={() => toAttestation()}>Go to your information</button>
    </div>
  );
}