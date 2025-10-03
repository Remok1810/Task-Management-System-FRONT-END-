import React from 'react'
import {useState} from 'react'
import './Login.css'
import { LoginApi } from '../services/Api'
import {storeUserData} from '../services/storage'
import {isAuthenticated} from '../services/Auth'
import {Link, Navigate} from 'react-router-dom'
import Navbar from '../Components/Navbar'

function Login() {
      

                    
   const initialStateErrors ={
      email:{required:false},
      password:{required:false},
      custom_error:null
   
   
   }
   const [errors,setErrors]=useState( initialStateErrors)

   
   const [Loading,setLoading] = useState(false)

   const [Input,setInputs]=useState({
      email:"",
      password:""
   })

   const handleInputs =(event)=>{

   setInputs({...Input,[event.target.name]:event.target.value})


}

   const handleSubmit =(event)=>{
      event.preventDefault()
   
   let errors =  initialStateErrors
   let hasError= false;
         if(Input.email == ""){
               errors.email.required=true;
               hasError= true;
         }
         if(Input.password == ""){
               errors.password.required=true;
               hasError= true;
         }
         if(!hasError){
            setLoading(true)
   
           LoginApi(Input).then((response)=>{
            console.log(response)
            storeUserData(response.data.idToken)
           }).catch((err)=>{
            if(err.code="ERR_BAD_REQUEST"){
                setErrors({...errors,custom_error:"INVALID ACCOUNT"})
            }
    
            console.log(err)
           }).finally(()=>{
            setLoading(false)
           })
   
         }
         setErrors({...errors})
      }


if(isAuthenticated()){

   return <Navigate  to="/dashboard" />


}
















  return (
    <div>
        < Navbar />
        <section className="login-block">
            <div className="container">
                <div className="row ">
                    <div className="col login-sec">
                        <h2 className="text-center">Login Now</h2>
                        <form onSubmit={handleSubmit} className="login-form" action="">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                            <input type="email"  className="form-control" name="email"  id="" placeholder="email" onChange={handleInputs} />
                        {errors.email.required?

                        (<span className="text-danger" >
                            Email is required.
                        </span>):null
                        }
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                            <input  className="form-control" type="password"  name="password" placeholder="password" id=""  onChange={handleInputs} />
                            {errors.password.required?
                           (<span className="text-danger" >
                            Password is required.
                        </span>):null
                        
                        }
                        </div>
                        <div className="form-group">
                              { Loading?
                        (<div  className="text-center">
                          <div className="spinner-border text-primary " role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>):null
                          }
                             {errors.custom_error?
                        (<span className="text-danger" >
                           <p>{errors.custom_error}</p>
                        </span>):null}

                            <input  type="submit" className="btn btn-login text-dark bg-white float-right"  disabled={Loading} value="Login" />
                        </div>
                        <div className="clearfix"></div>
                        <div className="form-group">
                        Create new account ? Please <Link to="/register" >Register</Link>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Login