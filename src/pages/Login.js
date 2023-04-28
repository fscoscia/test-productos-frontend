import { useState } from "react";
import {
    ListItem,
    LoginFooterItem,
    LoginForm,
    LoginMainFooterBandItem,
    LoginPage,
    Spinner,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [loginState, setLoginState] = useState({
        usernameValue: "",
        passwordValue: "",
        showHelperText: false,
        isValidUsername: true,
        isValidPassword: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    let navigate = useNavigate();

    const onLoginButtonClick = (event) => {
        event.preventDefault();
        if (!!loginState.usernameValue && !!loginState.passwordValue) {
            setIsLoading(true);
            auth.signIn(loginState.usernameValue, loginState.passwordValue)
                .then(() => {
                    navigate("/");
                })
                .catch(() => {
                    setLoginState({ ...loginState, showHelperText: true });
                    setIsLoading(false);
                });
        } else {
            setLoginState({
                ...loginState,
                isValidUsername: !!loginState.usernameValue,
                isValidPassword: !!loginState.passwordValue,
                showHelperText:
                    !loginState.usernameValue || !loginState.passwordValue,
            });
        }
    };

    const loginForm = (
        <LoginForm
            showHelperText={loginState.showHelperText}
            helperText={"Credenciales inválidas."}
            helperTextIcon={<ExclamationCircleIcon />}
            usernameLabel="Nombre de Usuario"
            usernameValue={loginState.usernameValue}
            onChangeUsername={(usernameValue) =>
                setLoginState({ ...loginState, usernameValue })
            }
            isValidUsername={loginState.isValidUsername}
            passwordLabel="Contraseña"
            passwordValue={loginState.passwordValue}
            isShowPasswordEnabled
            onChangePassword={(passwordValue) =>
                setLoginState({ ...loginState, passwordValue })
            }
            isValidPassword={loginState.isValidPassword}
            isLoginButtonDisabled={isLoading}
            onLoginButtonClick={onLoginButtonClick}
            onSubmit={onLoginButtonClick}
            loginButtonLabel={
                !isLoading ? "Ingresar" : <Spinner isSVG size="md" />
            }
        />
    );

    return (
        <LoginPage
            footerListVariants="inline"
            loginTitle="Iniciar Sesión"
            loginSubtitle="Ingrese su nombre de usario y contraseña."
        >
            {loginForm}
        </LoginPage>
    );
};

export default Login;
