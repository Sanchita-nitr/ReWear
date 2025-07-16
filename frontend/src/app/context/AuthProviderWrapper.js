"use client";

import { AuthProvider } from "./AuthContext";

export const AuthProviderWrapper = ({ children }) => {
    return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
