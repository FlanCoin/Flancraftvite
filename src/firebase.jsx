// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_fE8A0sx-gG61iP5zQZHyIb8yeTuALMM",
  authDomain: "flancoin-8dac3.firebaseapp.com",
  databaseURL: "https://flancoin-8dac3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flancoin-8dac3",
  storageBucket: "flancoin-8dac3.appspot.com",
  messagingSenderId: "120944858079",
  appId: "1:120944858079:web:0dfe4f329aa142e2dfea6a",
  measurementId: "G-G1B83XMRTT"
};

// Inicializa la app de Firebase y la base de datos
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referencias específicas para los datos
const clickCountRef = ref(database, 'clickCount');
const countryClicksRef = ref(database, 'countryClicks');
const playerHistoryRef = ref(database, 'playerHistory');
const dailySummaryRef = ref(database, 'dailySummary'); // ✅ NUEVA referencia

// Exporta las referencias para usarlas en los componentes
export {
  database,
  clickCountRef,
  countryClicksRef,
  playerHistoryRef,
  dailySummaryRef // ✅ Añadido aquí también
};
