import React, { useState } from "react";
import {
    Form,
    FormGroup,
    TextInput,
    ActionGroup,
    Button,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
const RegisterScreen = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
    });

    const handleChange = (key, value) => {
        setData({ ...data, [key]: value });
    };

    const nav = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ maxWidth: 400, padding: 40 }}>
                <h2>Completa tus datos</h2>
                <Form>
                    <FormGroup
                        label="Nombre"
                        isRequired
                        fieldId="simple-form-name-01"
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="simple-form-name-01"
                            name="simple-form-name-01"
                            aria-describedby="simple-form-name-01-helper"
                            value={data.firstName}
                            onChange={(e) => handleChange("firstName", e)}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Apellido"
                        isRequired
                        fieldId="simple-form-email-01"
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="simple-form-email-01"
                            name="simple-form-email-01"
                            value={data.lastName}
                            onChange={(e) => handleChange("lastName", e)}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Email"
                        isRequired
                        fieldId="simple-form-email-01"
                    >
                        <TextInput
                            isRequired
                            type="email"
                            id="simple-form-email-01"
                            name="simple-form-email-01"
                            value={data.email}
                            onChange={(e) => handleChange("email", e)}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Nombre de usuario"
                        isRequired
                        fieldId="simple-form-email-01"
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="simple-form-email-01"
                            name="simple-form-email-01"
                            value={data.username}
                            onChange={(e) => handleChange("username", e)}
                        />
                    </FormGroup>

                    <FormGroup label="Contraseña" isRequired>
                        <TextInput
                            isRequired
                            type="email"
                            id="simple-form-email-01"
                            name="simple-form-email-01"
                            value={data.password}
                            onChange={(e) => handleChange("password", e)}
                        />
                    </FormGroup>
                    <ActionGroup>
                        <Button variant="primary">Aceptar</Button>
                        <Button variant="link" onClick={() => nav("/products")}>
                            Cancelar
                        </Button>
                    </ActionGroup>
                </Form>
            </div>
        </div>
    );
};

export default RegisterScreen;
