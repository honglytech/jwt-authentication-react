import React, { useState}  from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import Axios from "axios";
import {checkUser} from "../utils/database";

export default function SignUp()  {
    const [firstNameReg, setFirstNameReg] = useState("");
    const [lastNameReg, setLastNameReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [dateOfBirthReg, setDateOfBirthReg] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const userData = location?.state?.data?.userData;
    Axios.defaults.withCredentials = true;

    const register = async () => {
        const result = await Axios.post("http://localhost:3001/register", {
        username: userData?.signing_id,
        firstname: firstNameReg,
        secondname: lastNameReg,
        dob: dateOfBirthReg,
        email: emailReg
      })

      if(result.data.success) {
        console.log("Database updated",result.data);
        navigate('/viewattestation',{state:{data: location?.state?.data}});
      }
      else {
        console.log("Database updated",result.data);
        alert(`Error in info${result.data.message}`);
      }

    };
  
    
      
        return (
            <div>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Your ID's i-address</label>
                    <input type="text" value={userData?.signing_id} className="form-control" placeholder="iaddress" disabled ={true}/>
                </div>

                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" placeholder="First name" onChange={(e) => setFirstNameReg(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" onChange={(e) => setLastNameReg(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={(e) => setEmailReg(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="text" className="form-control" placeholder="Date of birth e.g. YYYY-MM-DD" onChange={(e) => setDateOfBirthReg(e.target.value)} />
                </div>
                <br></br>
  
                <button type="submit" className="btn btn-primary btn-block" onClick={register}>Sign Up</button>
 
            </div>
        );
}
