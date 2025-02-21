import { signOut } from "next-auth/react";

const Logout = () => {

const handleLogout = async () => {
    try {
        // First sign out from NextAuth
        await signOut({ 
            redirect: false,
        });
        
        // Clear any client-side storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force a hard redirect to prevent back navigation
        window.location.replace('/auth/login');
    } catch (error) {
        console.error('Logout error:', error);
        // Fallback redirect
        window.location.replace('/auth/login');
    }
    };

  return <button onClick={handleLogout}>Sign Out</button>;
};

export default Logout;