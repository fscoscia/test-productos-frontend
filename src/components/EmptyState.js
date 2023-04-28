import React from "react";
import {
    Title,
    EmptyState as PFEmptyState,
    EmptyStateIcon,
    EmptyStateBody,
} from "@patternfly/react-core";

const EmptyState = ({ icon }) => (
    <PFEmptyState>
        <Title headingLevel="h4" size="lg">
            Productos
        </Title>
        <EmptyStateBody>
            Utilice el cuadro de búsqueda para mostrar una lista de resultados.
            <br />
            Puede buscar por nombre de producto.
        </EmptyStateBody>
    </PFEmptyState>
);

export default EmptyState;
