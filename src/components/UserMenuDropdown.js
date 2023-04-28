import { useState } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownPosition,
} from "@patternfly/react-core";
import CaretDownIcon from "@patternfly/react-icons/dist/esm/icons/caret-down-icon";
import { useAuth } from "../context/authContext";

const UserMenuDropdown = () => {
    const auth = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const onToggle = () => setIsOpen(!isOpen);
    const onFocus = () => {
        const element = document.getElementById("toggle-id");
        element.focus();
    };

    const onSelect = (event) => {
        onFocus();
        if (event.target.value === "logout") auth.signOut();
    };

    const dropdownItems = [
        <DropdownItem key="separated action" component="button" value="logout">
            Salir
        </DropdownItem>,
    ];

    return (
        <Dropdown
            onSelect={onSelect}
            toggle={
                <DropdownToggle
                    id="toggle-id"
                    onToggle={onToggle}
                    toggleIndicator={CaretDownIcon}
                >
                    {auth.userData?.username}
                </DropdownToggle>
            }
            isOpen={isOpen}
            dropdownItems={dropdownItems}
            isPlain
            position={DropdownPosition.right}
        />
    );
};

export default UserMenuDropdown;
