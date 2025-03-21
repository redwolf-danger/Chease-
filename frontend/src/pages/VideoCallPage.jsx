import React, { useEffect,useState } from 'react'
import {Loader } from "lucide-react"

const VideoCallPage = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

    //add jitsi exernal API
    useEffect(() => {
        // while(true){
          if(script_loaded){
            console.log("inside the if line");
            const api = new JitsiMeetExternalAPI("8x8.vc", {
              roomName: "vpaas-magic-cookie-f169971450494886bab35a0d35a23cd9/SampleApp",
              parentNode: document.querySelector('#jaascont1234'),
              jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkvNWM3NTVlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI1NTE0MTcsImV4cCI6MTc0MjU1ODYxNywibmJmIjoxNzQyNTUxNDEyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2MzA4MDYyNzc3OTA3NzMzODQ3IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ0ZXN0LnVzZXJAY29tcGFueS5jb20ifX0sInJvb20iOiIqIn0.DcxERD_4-Xd6ZAFPvwEar8ujsepJmYK5hxeTSN5zv-FiQ_LBwv1H-G4QinTxWDO_USuV0cu-_ZfxN2t8GRSu9aZTMHWNo_oFUxdjW3uf5jm0IieLJn5KX3LEfPClygdoO1hILICus0osJxp4xifXKpGK40r3k7_5F5kDm8oCWKJ2LDyRZC9lQBCYq4QhpS_ho8GraVBxtAG8Nede9D7YI0MHaBmIqGLVrd4nfJiK6y7grPk5d38gx7ckBtISc9JWkT19JIKpDP_y-571ZmViUphPZ30bodtaoXuy9vY6QZPr-hTQdh-3ovvbu2l9TmQKSTbeIlNqWaLYN--Cwp0XsA"
            });
            // break;
          };  
        // }
     
    }, [script_loaded]);

    return (
      <div id='jaascont1234' className='flex items-center justify-center h-screen' >
      {!script_loaded && <Loader className="size-10 animate-spin"/>}
    </div>
    )}

export default VideoCallPage
