import React from 'react'
import { useParams } from 'react-router-dom';

export default function CompeteLegacyForms() {
    const {sid, hsid}: any = useParams();



  return (
    <div>CompeteLegacyForms
        <p>sid: {sid}</p>
        <p>hsid: {hsid}</p>
    </div>
  )
}
