import React from 'react'
import { useParams } from 'react-router-dom'

export default function CaptureFormStats() {
    const { id } = useParams<{ id: string }>()


  return (
    <div>Coming Soon</div>
  )
}
