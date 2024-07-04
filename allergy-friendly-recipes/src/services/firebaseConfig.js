import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  // הכנס כאן את פרטי התצורה שלך מ-Firebase
};

firebase.initializeApp(firebaseConfig);

export default firebase;