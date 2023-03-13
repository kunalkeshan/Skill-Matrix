// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyD7UGAB9UiZI3P6Z5Db2UtbMC2KcdeOEXQ',
	authDomain: 'skill-matrix-2a884.firebaseapp.com',
	projectId: 'skill-matrix-2a884',
	storageBucket: 'skill-matrix-2a884.appspot.com',
	messagingSenderId: '269713768081',
	appId: '1:269713768081:web:ca3cceb9b2fd5454884930',
	measurementId: 'G-QVJG9P5S1R',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
