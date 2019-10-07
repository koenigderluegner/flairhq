import React from "react";
import { Card, CardTitle } from 'reactstrap';
import styled from 'styled-components';

const CardBody = styled.div`
    display:grid;
    grid-template-columns: 2fr 1fr;
`;

const Highlighted = styled.div`
    font-size: 5rem;
`;

export const Hatches = ({hatches}) => (
    <Card body>
        <CardTitle><h1>Hatches</h1></CardTitle>
        <CardBody>
            <Highlighted>{hatches.length}</Highlighted>
        </CardBody>
    </Card>
);