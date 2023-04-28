import {
    Bullseye,
    Button,
    Flex,
    FlexItem,
    InputGroup,
    Spinner,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
    FormSelect,
    FormSelectOption,
    Select,
    SelectOption,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import {
    ActionsColumn,
    TableComposable,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@patternfly/react-table";
import { useAuth } from "../context/authContext";

const ProductListScreen = () => {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [entityList, setEntityList] = useState([]);
    const [filters, setFilters] = useState({
        state: "",
        isOpenCategories: false,
        selectedCategories: [],
    });
    const [categories, setCategories] = useState([]);
    const auth = useAuth();
    const applyFilters = () => {
        if (search.length >= 3) {
            setIsLoading(true);
            api.products.getMulti(null, search).then((response) => {
                setEntityList(response);
                setIsLoading(false);
            });
        } else {
            setEntityList([]);
            setIsLoading(false);
        }
    };

    const onFilterSubmit = (e) => {
        e.preventDefault();

        applyFilters();
    };

    const onDelete = (id) => {
        setIsLoading(true);
        api.products.delete(id).then(() => {
            api.products.getMulti(null, search).then((response) => {
                setEntityList(response);
                setIsLoading(false);
            });
        });
    };

    const handleFilters = () => {
        let params = {};
        params["state"] = filters.state;
        if (filters.selectedCategories.length > 0) {
            params["categories"] = [];
            for (const r of filters.selectedCategories) {
                params["categories"].push(r);
            }
        }
        api.products.getMulti(null, "", 100, 0, params).then((response) => {
            setEntityList(response);
            setIsLoading(false);
        });
    };

    const onProteinuriaSelect = (event, selection) => {
        const selected = filters.selectedCategories;
        if (selected.includes(selection)) {
            const newSelection = selected.filter((el) => el !== selection);
            setFilters({
                ...filters,
                selectedCategories: newSelection,
            });
        } else {
            setFilters({
                ...filters,
                selectedCategories: [...selected, selection],
            });
        }
    };

    useEffect(() => {
        setIsLoading(true);
        api.categories.getMulti(null, "").then((response) => {
            setCategories(response);
        });

        api.products.getMulti(null, "").then((response) => {
            setEntityList(response);
            setIsLoading(false);
        });
    }, []);

    const toolbarItems = (
        <form onSubmit={onFilterSubmit} style={{ width: "100%" }}>
            <Flex
                justifyContent={{ default: "justifyContentSpaceBetween" }}
                alignItems={{ default: "alignItemsCenter" }}
            >
                <Flex alignItems={{ default: "alignItemsCenter" }}>
                    <FlexItem>
                        <InputGroup>
                            <TextInput
                                name="search"
                                id="search"
                                type="search"
                                value={search}
                                onChange={setSearch}
                                placeholder="Nombre de producto"
                            />
                        </InputGroup>
                    </FlexItem>
                    <FlexItem variant="separator" />
                    <FlexItem>
                        <Button
                            variant="primary"
                            type="submit"
                            isDisabled={search.length < 3}
                        >
                            Buscar
                        </Button>
                    </FlexItem>
                    <ToolbarItem variant="label">Estado</ToolbarItem>
                    <ToolbarItem>
                        <FormSelect
                            id="consultationType"
                            value={filters.state}
                            onChange={(v) =>
                                setFilters({ ...filters, state: v })
                            }
                        >
                            <FormSelectOption key="0" value="" label="Todos" />
                            <FormSelectOption
                                key="1"
                                value={0}
                                label="No disponible"
                            />
                            <FormSelectOption
                                key="2"
                                value={1}
                                label="Disponible"
                            />
                        </FormSelect>
                    </ToolbarItem>
                    <ToolbarItem variant="label">Categorías</ToolbarItem>

                    <ToolbarItem>
                        <Select
                            variant="checkbox"
                            onToggle={(isOpen) =>
                                setFilters({
                                    ...filters,
                                    isOpenCategories: isOpen,
                                })
                            }
                            onSelect={onProteinuriaSelect}
                            selections={filters.selectedCategories}
                            isOpen={filters.isOpenCategories}
                            placeholderText="Seleccionar"
                        >
                            {categories.map((cat) => (
                                <SelectOption key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectOption>
                            ))}
                        </Select>
                    </ToolbarItem>
                </Flex>
                <Button variant="secondary" onClick={handleFilters}>
                    Aplicar filtros
                </Button>
            </Flex>
        </form>
    );

    return (
        <>
            <Toolbar>
                <ToolbarContent>{toolbarItems}</ToolbarContent>
            </Toolbar>
            {isLoading && (
                <Bullseye>
                    <Spinner isSVG />
                </Bullseye>
            )}
            {!isLoading && (
                <TableComposable>
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Estado</Th>
                            {auth.isAuthenticated ? (
                                <>
                                    <Th>Categorías</Th>
                                    <Th>Imagen</Th>
                                </>
                            ) : null}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {entityList.map((el) => {
                            let categories = "";
                            if (auth.isAuthenticated) {
                                categories = String(
                                    el.categories.map((e) => e.name)
                                );
                            }

                            return (
                                <Tr key={el.id}>
                                    <Td style={{ verticalAlign: "middle" }}>
                                        {el.name}
                                    </Td>
                                    <Td style={{ verticalAlign: "middle" }}>
                                        {el.state}
                                    </Td>
                                    {auth.isAuthenticated ? (
                                        <>
                                            <Td
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {categories}
                                            </Td>
                                            <Td>
                                                <img
                                                    src={el.images}
                                                    style={{ width: 50 }}
                                                />
                                            </Td>
                                        </>
                                    ) : null}
                                    {auth.isAuthenticated ? (
                                        auth.userData.approved ? (
                                            <Td
                                                dataLabel={"Acciones"}
                                                modifier="fitContent"
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <Button
                                                    variant="secondary"
                                                    style={{ marginRight: 5 }}
                                                >
                                                    {"Editar"}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        onDelete(el.id);
                                                    }}
                                                >
                                                    {"Eliminar"}
                                                </Button>
                                            </Td>
                                        ) : null
                                    ) : null}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </TableComposable>
            )}
            {entityList.length === 0 && !isLoading && <EmptyState />}
        </>
    );
};

export default ProductListScreen;
