# 🏥 Care-Alert — Smart Healthcare Web App

> *Your health, our priority.*

Care-Alert is a full-stack healthcare web application that helps patients manage their health digitally — from booking doctor appointments to emergency SOS alerts, all in one place.

---

## 🌐 Live Demo

👉 **[https://ruheena-6ee3c.web.app](https://ruheena-6ee3c.web.app)**

---

## ✨ Features

- 🔐 **User Authentication** — Secure login & registration
- 🏠 **Dashboard** — Health overview with vitals & quick actions
- 🏥 **Find Hospital** — GPS-based nearest hospital finder on map
- 📅 **Book Appointment** — Schedule doctor visits online
- 💊 **Order Medicines** — Browse & order medicines with cart
- 📋 **Prescriptions** — View digital doctor prescriptions
- 🩹 **First Aid Guide** — Step-by-step emergency instructions
- 🚨 **Emergency SOS** — SOS alert with live GPS location
- 🎥 **Video Consultation** — Live HD video call with doctors

---

## 🛠️ Built With

| Technology | Purpose |
|-----------|---------|
| React.js | Frontend UI |
| Firebase Auth | User login & registration |
| Firebase Firestore | Database |
| Firebase Hosting | Live deployment |
| Agora RTC | Video calling |
| Leaflet.js | Hospital map |
| Overpass API | Real hospital data |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Care-Alert.git
cd Care-Alert
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your Firebase config file

> ⚠️ **Note:** This project requires a `firebase.js` file which is not included in this repository for security reasons. You need to create your own.

Create a file at `src/firebase.js` and add your Firebase configuration:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

> Get these values from [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings → Web App.

### 4. Run the app
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Care-Alert/
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── FindHospital.js
│   │   ├── BookAppointment.js
│   │   ├── Prescription.js
│   │   ├── OrderMedicines.js
│   │   ├── FirstAid.js
│   │   ├── Emergency.js
│   │   └── Consultation.js
│   ├── App.js
│   ├── index.js
│   └── firebase.js  ← Create this yourself
├── public/
├── package.json
└── README.md
```

---

## 👩‍💻 Developer

Made by **Ruheena Shaik**

---

## 📄 License

This project is for educational purposes.
