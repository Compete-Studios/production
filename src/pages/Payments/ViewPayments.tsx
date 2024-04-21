import React from 'react';
import { useParams } from 'react-router-dom';

export default function ViewPayments() {
    const { id, stud } = useParams();
    return <div>ViewPayments</div>;
}
