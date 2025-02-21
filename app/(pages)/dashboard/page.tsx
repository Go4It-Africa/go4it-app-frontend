'use client'

import { signOut } from "next-auth/react";

const DashboardPage = () => {
  return <div>
    Dashboard
    <button onClick={() => signOut()}>Logout</button>
    </div>
};

export default DashboardPage;