import React, { useState } from 'react'

const GooglePageSignIn = () => {
    const [SigningUp,setSigningUp] = useState(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setSigningUp(true)

    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
        <button type="submit" disabled = {SigningUp}>Google</button>
        </form>
    </div>
  )
}

export default GooglePageSignIn
