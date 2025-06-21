import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyANb4sBQDX_9FIv_W5OVRNZ6teRukkyhi4",
  authDomain: "sosyal-337d7.firebaseapp.com",
  projectId: "sosyal-337d7",
  storageBucket: "sosyal-337d7.appspot.com",
  messagingSenderId: "943784748832",
  appId: "1:943784748832:ios:01f5276b58899912b01945",
};

// Uygulama daha önce initialize edilmediyse başlat
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
