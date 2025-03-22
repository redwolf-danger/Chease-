import React, { useState } from 'react'

const GooglePageSignUp = () => {
    const [SigningUp,setSigningUp] = useState(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setSigningUp(true)

    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
        <button type="submit" disabled = {SigningUp}>Sign Up with Google</button>
        </form>
    </div>
  )
}

export default GooglePageSignUp
