
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1QgGLl6h3tVxrqO_3qVu0Q_gp4jn2f6g",
  authDomain: "image-uploader-progger.firebaseapp.com",
  projectId: "image-uploader-progger",
  storageBucket: "image-uploader-progger.appspot.com",
  messagingSenderId: "1074291328711",
  appId: "1:1074291328711:web:0f9a5c2b5c3f7e8be6a3f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
