import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import { Button } from '@material-ui/core';
import Profile from './Profile';

function Register(){

    const [form, setForm] = useState({
        email: '',
        password: '',
        password2: ''
    });
    const [redirect, setRedirect] = useState(false);
    const [profile, setProfile] = useState(false);
    const [email, setEmail] = useState(false);

    function signUp(e){
        e.preventDefault();
        if(form.password != form.password2){
            alert("Passwords do not match!")
        }else{
            firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
            .then((userCredential) => {
                setEmail(userCredential.user.email);
                setProfile(true);
            })
            .catch((error) => {
                console.log(error.code);
                alert(error.message);
            });    
        };
    };
    if(redirect){
        return <Redirect to="/signin"></Redirect>
    };

    return(
        <>
        {!profile?(<div className="register">
            <form className="login-form" onSubmit={(e)=>signUp(e)}>
                <div className="login-title"><h3>Sign Up</h3></div>
                <input type="email" placeholder="Enter Email" className="form-input" onChange={(e)=>{
                        setForm({...form, email: e.target.value});
                    }}></input>
                <input type="password" placeholder="Enter Password" className="form-input" onChange={(e)=>{
                        setForm({...form, password: e.target.value});
                    }}></input>
                <input type="password" placeholder="Confirm Password" className="form-input" onChange={(e)=>{
                        setForm({...form, password2: e.target.value});
                    }}></input>
                <Button type="submit" variant="outlined" className="submit-button">Submit</Button>
            </form>
        </div>):null}
        {profile?<Profile email={email} />:null} 
        </>   
    );
};

export default Register;