"use client"
import React from 'react'

export function AlignmentPill({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${color}`}>
      Alignment {value}%
    </span>
  )
}


