import React, { useEffect } from 'react'
import LoginPage from '../components/LoginPage'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0';

import Start from '../components/Start'


export default function Login() {
    const router = useRouter();
    const { user, error, isLoading } = useUser();
      useEffect(() =>{

        if(user){
            router.push("/")
        }
          
      },[user])

     
        return (
            <div>
            {!user &&
              <LoginPage/>
            }
               <Start/>

           </div>
          )

      
  
}
