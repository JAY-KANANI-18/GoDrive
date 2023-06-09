importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCHk1QsDZ0R6cnKY011100ylciMufQjqto",
  authDomain: "godrive-9e426.firebaseapp.com",
  projectId: "godrive-9e426",
  storageBucket: "godrive-9e426.appspot.com",
  messagingSenderId: "1079628430087",
  appId: "1:1079628430087:web:f963c478544f6d295fe3a2",
  measurementId: "G-2HYGM8Z8H3"});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
