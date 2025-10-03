import React from 'react'
import './RegisterPage.css'
import { RegistorApi } from '../services/Api'

import {useState} from 'react'
import { storeUserData } from '../services/storage'
import { isAuthenticated } from '../services/Auth'
import {Link, Navigate} from 'react-router-dom'
import Navbar from '../Components/Navbar'
function RegisterPage() {
                  
   const initialStateErrors ={
      email:{required:false},
      password:{required:false},
      name:{required:false},
      custom_error:null
   
   
   }
   const [errors,setErrors]=useState( initialStateErrors)

const [Loading,setLoading] = useState(false)

const handleSubmit =(event)=>{
   event.preventDefault()

let errors =  initialStateErrors
let hasError= false;
   if(Input.name == ""){
            errors.name.required=true;
            hasError= true;
      } 
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

        RegistorApi(Input).then((response)=>{
         console.log(response)
         storeUserData(response.data.idToken)
        }).catch((err)=>{
         if(err.response.data.error.message=="EMAIL_EXISTS")
            {
            setErrors({...errors,custom_error:"Already this email has been registered"})
         }else if(String(err.response.data.error.message).includes('WEAK_PASSWORD')){

          setErrors({...errors,custom_error:"PASSWORD ATLEAST SIX CHARACTERS"})
         }
         
         

         

         console.log(err)
        }).finally(()=>{
         setLoading(false)
        })

      }
      setErrors({...errors})
   }



const [Input,setInputs]=useState({
   email:"",
   password:"",
   name:""
})

const handleInputs =(event)=>{

   setInputs({...Input,[event.target.name]:event.target.value})


}

if(isAuthenticated()){

   return <Navigate  to="/dashboard" />


}




  return (

    <div>
      <Navbar />
            <section className="register-block">
            <div className="container">
               <div className="row ">
                  <div className="col register-sec">
                     <h2 className="text-center">Register Now</h2>
                     <form onSubmit={handleSubmit} className="register-form" action="" >
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Name</label>
          
                        <input type="text" className="form-control" name="name" id=""  onChange={handleInputs} />
                       { errors.name.required?
                        (<span className="text-danger" >
                            Name is required.
                        </span>):null}
                        
                     </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
          
                        <input type="text"  className="form-control" name="email" id="" onChange={handleInputs} / >
                       {errors.email.required?
                        (<span className="text-danger" >
                            Email is required.
                        </span>):null
                                  }
                     </div>
                     <div className="form-group">
                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                        <input  className="form-control" type="password"  name="password" id="" onChange={handleInputs} />
                        {errors.password.required?
                           (<span className="text-danger" >
                            Password is required.
                        </span>):null
                        
                        }
                     </div>
                     <div className="form-group">
                        {errors.custom_error?
                        (<span className="text-danger" >
                           <p>{errors.custom_error}</p>
                        </span>):null
                        }
                        { Loading?
                        (<div  className="text-center">
                          <div className="spinner-border text-primary " role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>):null
                          }
          
                        <input type="submit" className="btn btn-login bg-white text-dark float-right"  disabled={Loading} value="Register" />
                     </div>
                     <div className="clearfix"></div>
                     <div className="form-group">
                       Already have account ? Please <Link to="/login">Login</Link>
                     </div>
          
          
                     </form>
          
          
                  </div>
          
               </div>
          
          
            </div>
          </section>
    </div>
  )
}

export default RegisterPage;