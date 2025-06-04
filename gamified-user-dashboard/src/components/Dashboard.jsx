import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateLastAction = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        lastAction: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating last action:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    const checkAndCreateUserDoc = async () => {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        console.log("User document not found. Creating...");
        await setDoc(userDocRef, {
          email: user.email,
          xp: 0,
          level: 1,
          streak: 0,
          lastAction: serverTimestamp(),
          achievements: [],
          createdAt: serverTimestamp()
        });
      }
    };

    // Ensure document exists before listening
    checkAndCreateUserDoc().then(() => {
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("User document still does not exist.");
          setUserData(null);
        }
      });

      return () => unsubscribe();
    });

    // Update last action when component mounts
    updateLastAction();
  }, []);

  if (!userData) return <p>Loading user data...</p>;

  return (
    <div style={{
      height: '100vh',
      width: '100%',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Header Section */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Gamified Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Logout
          </button>
        </div>
        <p style={{ 
          color: '#7f8c8d', 
          margin: 0,
          fontSize: '1.5rem'
        }}>
          Welcome, {userData.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        width: '100%',
        backgroundColor: 'red'
      }}>
      <StatCard label="XP" value={userData.xp || 0} color="#3498db" />
      <StatCard label="Level" value={userData.level || 1} color="#2ecc71" />
      <StatCard label="Streak" value={`${userData.streak || 0} days`} color="#e74c3c" />
      </div>
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'green',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3>Last Action</h3>
        <p style={{ color: '#7f8c8d' }}>
          {userData.lastAction
            ? new Date(userData.lastAction.seconds * 1000).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3>Account Created</h3>
        <p style={{ color: '#7f8c8d' }}>
          {userData.createdAt
            ? new Date(userData.createdAt.seconds * 1000).toLocaleString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div style={{
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <h3>{label}</h3>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>{value}</p>
  </div>
);

export default Dashboard;
