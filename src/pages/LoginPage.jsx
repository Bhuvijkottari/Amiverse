import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import amiAnimation from "../assets/ami.json";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("child");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !age || !email || !password || !confirmPassword || !parentPin) {
      setError("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (parentPin.length !== 4) {
      setError("Parent PIN must be 4 digits");
      return;
    }

    try {
       const usersRef = collection(db, "users");
    const pinQuery = query(usersRef, where("parentPin", "==", parentPin));
    const querySnapshot = await getDocs(pinQuery);

    if (!querySnapshot.empty) {
      setError("Parent PIN already exists, please choose another");
      return;
    }
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        age,
        email,
        role: "child",
        parentPin,
        rewards: {
          stars: 0,
          stickers: 0,
        },
        features: {},
      });

      await setDoc(doc(db, "parentPins", parentPin), {
        uid,
        name,
      });

      setSuccess("Registration successful! Please login.");
      setTimeout(() => {
        setIsRegister(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (role === "parent") {
        const q = query(collection(db, "users"), where("parentPin", "==", parentPin));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Invalid PIN");
          return;
        }

        localStorage.setItem("parentPin", parentPin);
        navigate("/parentdashboard");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
        const userData = docSnap.data();

        navigate("/homepage", {
          state: {
            name: userData.name,
            docId: userCred.user.uid,
          },
        });
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-purple-800 mb-4">╰•AMIVERSE•╯</h1>
      <div className="w-40 my-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      <div className="bg-white/80 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-purple-700">
          {isRegister ? "📝 Register" : "🔐 Login"}
        </h2>

        {!isRegister && (
          <div className="flex justify-center gap-4 mb-2">
            <button
              className={`px-4 py-2 rounded-full ${role === "child" ? "bg-orange-400 text-white" : "bg-gray-200"}`}
              onClick={() => setRole("child")}
            >
              👶 Child
            </button>
            <button
              className={`px-4 py-2 rounded-full ${role === "parent" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setRole("parent")}
            >
              👨‍👩‍👧 Parent
            </button>
          </div>
        )}

        {isRegister ? (
          <>
            <input className="w-full p-2 border rounded" placeholder="Child's Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" className="w-full p-2 border rounded" placeholder="Retype Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <input type="password" className="w-full p-2 border rounded" placeholder="Set 4-digit Parent PIN" maxLength={4} value={parentPin} onChange={(e) => setParentPin(e.target.value)} />
          </>
        ) : (
          role === "child" ? (
            <>
              <input className="w-full p-2 border rounded" placeholder="Email or Name" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          ) : (
            <input type="password" className="w-full p-2 border rounded" placeholder="Enter 4-digit Parent PIN" maxLength={4} value={parentPin} onChange={(e) => setParentPin(e.target.value)} />
          )
        )}

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-full"
        >
          {isRegister ? "✅ Register" : "➡️ Login"}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-purple-700 underline text-center w-full"
        >
          {isRegister ? "Already registered? Login" : "New user? Register here"}
        </button>
      </div>
    </div>
  );
}
