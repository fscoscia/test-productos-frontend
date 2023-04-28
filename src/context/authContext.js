import axios from "axios";
import { createContext, useContext, useState } from "react";
import api from "../services/api";

/**
 * Decodes a JWT
 * @param {String} token Encoded JWT
 * @returns Object with decoded JWT data
 */
function parseJwt(token) {
    if (!token) {
        return null;
    }
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

const AuthContext = createContext({});

let interceptorId = null;

function AuthProvider({ children }) {
    let accessToken = localStorage.getItem("accessToken");
    let tokenData = parseJwt(accessToken);
    const [userData, setUserData] = useState(
        tokenData ? JSON.parse(localStorage.getItem("userData")) : null
    );
    const [isAuthenticated, setIsAuthenticated] = useState(
        tokenData ? Date.now() <= tokenData.exp * 1000 : false
    );

    const requestInterceptor = (config) => {
        /* If JWT is not expired, add Authorization header. Else, redirect to login */
        if (Date.now() <= tokenData.exp * 1000) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
            return config;
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
    };

    const signIn = async (username, password) => {
        /**
         * Attempts to log a user into the system
         * @param {String} username username
         * @param {*} password user password
         * @returns Object with `status: "success"` if user was logged in or
         * `status: "error"` otherwise.
         * Additonally, a `status: "error"` can contain a `detail` key with extra info.
         */
        try {
            const response = await api.users.getToken(username, password);
            accessToken = response.accessToken;
            localStorage.setItem("accessToken", accessToken);
            tokenData = parseJwt(accessToken);
            interceptorId = axios.interceptors.request.use(requestInterceptor);
            const _userData = await api.users.getOne(tokenData.user_id);
            localStorage.setItem("userData", JSON.stringify(_userData));
            setIsAuthenticated(true);
            setUserData(_userData);
            return Promise.resolve({ status: "success" });
        } catch (e) {
            console.error(e);
            return Promise.reject({
                status: "error",
                detail: "Invalid credentials",
            });
        }
    };

    const signOut = () => {
        axios.interceptors.request.eject(interceptorId);
        interceptorId = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        window.location.reload();
    };

    // Check that interceptor is added when authentication status changes
    if (isAuthenticated && !interceptorId) {
        interceptorId = axios.interceptors.request.use(requestInterceptor);
    }

    const context = {
        isAuthenticated,
        signIn,
        signOut,
        userData,
    };
    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
}

const AuthConsumer = ({ children }) => (
    <AuthContext.Consumer>{children}</AuthContext.Consumer>
);
const useAuth = () => useContext(AuthContext);

export { AuthProvider, AuthConsumer, useAuth };
export default AuthContext;
