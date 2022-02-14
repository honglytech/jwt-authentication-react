import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import AuthService from "./services/auth.service";
import { makeDocument, makeAttestation, makeObfuscated } from "../utils/exportattestation"
import Modal from 'react-modal';
import PostService from "../services/post.service";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');
export default function ViewAttestation() {
  const [data, setData] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [attJSON, setAttJSON] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const signer = "verus-consent-login@";
  const location = useLocation();
  const userData = location?.state?.data;

  const navigate = useNavigate();

  useEffect(() => {
    PostService.getAllPrivatePosts().then(
      (response) => {
        setData(response.data);
      },
      (error) => {
        console.log("Private page", error.response);
        // Invalid token
        if (error.response && error.response.status === 403) {
          AuthService.logout();
          navigate("/home");
        }
      }
    );
  }, [navigate]);

  async function openDoc() {
    setModalTitle("Your Document");
    makeDocument(data).then((data) => setAttJSON(data))
    setIsOpen(true);
  }

  async function openAttestation() {
    setModalTitle("Your Attestation");
    makeAttestation(data).then((data) => setAttJSON(data))
    setIsOpen(true);
  }

  async function openObfuscated() {
    setModalTitle("Your Obfuscated Document");
    makeObfuscated(data).then((data) => setAttJSON(data))
    setIsOpen(true);

  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.

  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <h3>Wrapped Document Data</h3>

      <div className="form-group">
        <label>Your ID's i-address</label>
        <input type="text" value={userData?.userData.signing_id} className="form-control" placeholder="iaddress" disabled={true} />
      </div>

      <div className="form-group">
        <label>First Name</label>
        <input type="text" value={data?.firstname} className="form-control" placeholder="First name" disabled={true} />
      </div>

      <div className="form-group">
        <label>Last name</label>
        <input type="text" value={data?.secondname} className="form-control" placeholder="Last name" disabled={true} />
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input type="email" value={data?.email} className="form-control" placeholder="Enter email" disabled={true} />
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input type="text" value={data.dob ? data.dob.slice(0, 10) : null} className="form-control" placeholder="Date of birth e.g. YYYY-MM-DD" disabled={true} />
      </div>

      <div className="form-group">
        <label>Signed by </label>
        <input type="text" value={signer} className="form-control" placeholder="Date of birth e.g. YYYY-MM-DD" disabled={true} />
      </div>
      <br></br>
      <div>
        <button type="button" className="btn btn-primary" onClick={async (e) => { await openDoc(); e.target.blur() }} >Export Document</button>

      </div>
      This is the wrapped document containing all the data.
      <br></br>
      <br></br>
      <div>
        <button type="button" className="btn btn-primary" onClick={(e) => { openAttestation(); e.target.blur() }} >Export Attestation</button>
      </div>
      This is the wrapped document + the attestation proof.
      <br></br>
      <br></br>
      <div>
        <button type="button" className="btn btn-primary" onClick={(e) => { openObfuscated(); e.target.blur() }} >Export Attestation</button>
      </div>
      This is the zero-knowledge document + the attestation proof, only reviling your age.
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="JSON Modal"
      >
        <h3 >{modalTitle}</h3>
        <div><pre>{attJSON}</pre></div>
        <button type="button" className="btn btn-primary" onClick={closeModal}>close</button>
      </Modal>
    </div>

  );
}
