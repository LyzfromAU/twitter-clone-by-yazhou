import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from 'react-redux';
import firebase from "firebase/app";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { getUser } from "./actions/getUser";
import db from './firebase';


function Login(){
    const [login, setLogin] = useState({
        email: '',
        password: ''
    });
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();
    function toLogin(e){
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(login.email, login.password)
        .then((userCredential) => {
            console.log('login success');
            db.collection("users").where("email", "==", userCredential.user.email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    dispatch(getUser(userCredential.user.email, doc.id));
                    localStorage.setItem('twitter-clone-user-email', userCredential.user.email);
                    localStorage.setItem('twitter-clone-user-id', doc.id);
                    localStorage.setItem('twitter-clone-user-status', true);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
            setRedirect(true);
        })
        .catch((error) => {
            alert(error);
        });
    };
    if(redirect){
        return <Redirect to="/"></Redirect>
    }
    return(
        <div className="login">   
            <form className="login-form" onSubmit={(e)=>toLogin(e)}>
                <div className="login-title"><h3>Sign In</h3></div>
                <input type="text" placeholder="Email" className="form-input" onChange={(e)=>{
                    setLogin({...login, email: e.target.value});
                    }}></input>
                <input type="password" placeholder="Password" className="form-input" onChange={(e)=>{
                    setLogin({...login, password: e.target.value});
                    }}></input>
                <p className="no-account">Don't have an account with us? <Link className="links" to="/signup">Sign Up</Link> now</p>
                <Button type="submit" variant="outlined" className="submit-button">Submit</Button>  
            </form>
        </div>
    );
};

export default Login;