// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// todo: environmentify these
// todo: change url in github to loalhost :5001 for testing

const firebaseConfig = {
    apiKey: "AIzaSyCsAzI9sFkxjIeM4WfdLweEHahY5_4OS5I",
    authDomain: "chease-dease.firebaseapp.com",
    projectId: "chease-dease",
    storageBucket: "chease-dease.firebasestorage.app",
    messagingSenderId: "916487592252",
    appId: "1:916487592252:web:9a1995cd83f21ddc2e6639",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);