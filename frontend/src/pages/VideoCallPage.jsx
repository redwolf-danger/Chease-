import React, { useEffect,useState } from 'react'
import { Loader } from "lucide-react"
import { JaaSMeeting } from '@jitsi/react-sdk';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const VideoCallPage = () => {
  const [token,setToken] = useState("");

    useEffect(() => {
      const set_token = async ()=>{
        try{
          const res = await axiosInstance.post("/auth/giveCookie");
          setToken(res.data);
        }
        catch(error){
          console.log(error);
          toast.error("Some Problem Occured. Please Try Again");
        };
      }
      set_token();
    }, []);

    return (
      <div id='jaascont1234' className='flex items-center justify-center h-screen' >
   {token.length === 0 ? <Loader className="size-10 animate-spin"/> :
   <JaaSMeeting
          getIFrameRef = { node => node.style.height = '800px' }
            appId = { 'vpaas-magic-cookie-f169971450494886bab35a0d35a23cd9' }
            jwt = 
            // "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkvNWM3NTVlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI1NjM0NjQsImV4cCI6MTc0MjU3MDY2NCwibmJmIjoxNzQyNTYzNDU5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImFkdmFpdGFzb25pIiwiaWQiOiJnb29nbGUtb2F1dGgyfDExNjMwODA2Mjc3NzkwNzczMzg0NyIsImF2YXRhciI6IiIsImVtYWlsIjoiYWR2YWl0YXNvbmlAZ21haWwuY29tIn19LCJyb29tIjoiKiJ9.YkUy4kEipEzSkQod0rpD_mx7Y478blBlJoFLc7L3zpCLiVw4EJdyI9v8_pW1XodPZI4pkt5At-EmW4WA7u3ExaEvQdDvEWJoGFajugrWaDM7UKqhHMI9H-UV-TCQvEYWtsP4nEotAwf64uKpQlP7J553bl0QKdSq0Xf7Ehcx1inYEPpE32iCZUJFPHL3_X_LfBaNXjqz-45Z2LjDYotI0vAdQAx9Gu2auQCz_icTx3PnFOAibSzyV7sHPKLTNeFWHzcrfBKEQf_Tu4jYNxzq68sssxbqnjUysqwowD7XYfILMHcJvAUZEoFB18Js9KkX76iXi-lXymeF8i70BvQezw"
            // "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkvNWM3NTVlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI1NjA1MjEsImV4cCI6MTc0MjU2NzcyMSwibmJmIjoxNzQyNTYwNTE2LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImFkdmFpdGFzb25pIiwiaWQiOiJnb29nbGUtb2F1dGgyfDExNjMwODA2Mjc3NzkwNzczMzg0NyIsImF2YXRhciI6IiIsImVtYWlsIjoiYWR2YWl0YXNvbmlAZ21haWwuY29tIn19LCJyb29tIjoiKiJ9.UVfGBeqi4dQ5s_wT9obN2yMD2QB3EIyOFRnIqq15UaGehdIlD-OI6ur_eJ9OgdAd6gUwxbEdrIG5zkZpC3msrYikoEhFuGnCggDrmnkIiLKfeJATRBlyG2a4RA-TWKGte0zCaSGM-GgSqZolhaF9UG_zPQ_l_WZzqhw8sFfAH7nUvuOVdJKghBkdVs-FjZUWSGoOHCxYeVNxk3HYCwecDIM6h38ibPU_4s44GcBu1Ked2-BDKOrUXjlgbkxpCwjbIBbSTpcFuz9DkeNv7aFWnRxYrsBSEK0hEoXqc1wwR2msMovvWiz4ZHrtdspb-xRPcFZ7D4Jd_Y52SQmM5ssg5w"
            // "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkvNWM3NTVlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDI1NTE0MTcsImV4cCI6MTc0MjU1ODYxNywibmJmIjoxNzQyNTUxNDEyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjE2OTk3MTQ1MDQ5NDg4NmJhYjM1YTBkMzVhMjNjZDkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE2MzA4MDYyNzc3OTA3NzMzODQ3IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ0ZXN0LnVzZXJAY29tcGFueS5jb20ifX0sInJvb20iOiIqIn0.DcxERD_4-Xd6ZAFPvwEar8ujsepJmYK5hxeTSN5zv-FiQ_LBwv1H-G4QinTxWDO_USuV0cu-_ZfxN2t8GRSu9aZTMHWNo_oFUxdjW3uf5jm0IieLJn5KX3LEfPClygdoO1hILICus0osJxp4xifXKpGK40r3k7_5F5kDm8oCWKJ2LDyRZC9lQBCYq4QhpS_ho8GraVBxtAG8Nede9D7YI0MHaBmIqGLVrd4nfJiK6y7grPk5d38gx7ckBtISc9JWkT19JIKpDP_y-571ZmViUphPZ30bodtaoXuy9vY6QZPr-hTQdh-3ovvbu2l9TmQKSTbeIlNqWaLYN--Cwp0XsA"
            { `${token}` }
            roomName = { 'MY_ROOM' }
/>
}
    </div>

    )}

export default VideoCallPage
