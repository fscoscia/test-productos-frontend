import "./App.css";
import { useState } from "react";
import {
    Routes,
    Route,
    BrowserRouter as Router,
    Navigate,
    Link,
} from "react-router-dom";
import { useAuth } from "./context/authContext";
import { Page, PageHeader, PageHeaderTools } from "@patternfly/react-core";
import UserMenuDropdown from "./components/UserMenuDropdown";

import ProductListScreen from "./pages/ProductListScreen";
import Login from "./pages/Login";
import RegisterScreen from "./pages/RegisterScreen";

function App() {
    const auth = useAuth();

    const Header = (
        <PageHeader
            logoComponent="h2"
            headerTools={
                <PageHeaderTools>
                    {auth.isAuthenticated ? (
                        <UserMenuDropdown />
                    ) : (
                        <>
                            <Link
                                to={"/login"}
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                    marginRight: 30,
                                }}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to={"/register"}
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                }}
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </PageHeaderTools>
            }
            showNavToggle={false}
        />
    );

    return (
        <Router>
            <Page header={Header}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/products" element={<ProductListScreen />} />
                    <Route path="*" element={<Navigate to="/products" />} />
                </Routes>
            </Page>
        </Router>
    );
}

export default App;
