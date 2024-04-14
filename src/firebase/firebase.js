import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBnstl7xnRz5G8K0IM0J2j8wSOglUnu3HI",
  authDomain: "compete-f8fc5.firebaseapp.com",
  projectId: "compete-f8fc5",
  storageBucket: "compete-f8fc5.appspot.com",
  messagingSenderId: "738923508540",
  appId: "1:738923508540:web:f9a322233ed46b92402439",
  measurementId: "G-GBBWR86905"
}

//testing compete

// const firebaseConfig = {
//   apiKey: "AIzaSyC4ErCB8MIpFhiIEPOAxsajfRndu-WSwDA",
//   authDomain: "competestudiotest.firebaseapp.com",
//   projectId: "competestudiotest",
//   storageBucket: "competestudiotest.appspot.com",
//   messagingSenderId: "185025058351",
//   appId: "1:185025058351:web:37fa5ce2188ab1494718da"
// }

initializeApp(firebaseConfig)
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
