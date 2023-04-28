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

function App() {
    const auth = useAuth();

    const Header = (
        <PageHeader
            logoComponent="h2"
            headerTools={
                <PageHeaderTools>
                    {auth.userData ? (
                        <UserMenuDropdown />
                    ) : (
                        <Link
                            to={"/login"}
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            Iniciar sesión
                        </Link>
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
                    <Route path="/products" element={<ProductListScreen />} />
                    <Route path="*" element={<Navigate to="/products" />} />
                </Routes>
            </Page>
        </Router>
    );
}

export default App;
