'use client'

import { useRef } from 'react'
import type { Category } from '@/lib/types'
import { useSearchParams } from 'next/navigation'

interface SearchBarProps {
  categories: Category[]
  compact?: boolean
}

export default function SearchBar({ categories, compact }: SearchBarProps) {
  const searchParams = useSearchParams()
  const currentQ = searchParams.get('q') || ''
  const currentCat = searchParams.get('cat') || ''
  const allRef = useRef<HTMLInputElement>(null)
  const catRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleAllChange() {
    // When "All" is checked, uncheck all category checkboxes
    if (allRef.current?.checked) {
      catRefs.current.forEach(ref => {
        if (ref) ref.checked = false
      })
    }
  }

  function handleCatChange() {
    // When any category is checked, uncheck "All"
    const anyCatChecked = catRefs.current.some(ref => ref?.checked)
    if (allRef.current) {
      allRef.current.checked = !anyCatChecked
    }
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <input
          type="text"
          name="q"
          defaultValue={currentQ}
          style={{ width: 224, padding: 3, fontSize: 11, fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }}
        />
        <input type="submit" value="Pirate Search" style={{ fontSize: 11, fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }} />
        <select name="cat" defaultValue={currentCat} className="cat-select">
          <option value="">All</option>
          {categories.map(cat => (
            <optgroup key={cat.id} label={cat.name}>
              {cat.sub.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    )
  }

  return (
    <>
      <p id="inp">
        <input
          name="q"
          type="text"
          title="Pirate Search"
          placeholder="Pirate Search"
          autoFocus
          required
          defaultValue={currentQ}
          style={{ width: 224, padding: 3, fontSize: 11, fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }}
        />
      </p>
      <p id="chb">
        <label>
          <input
            name="cat"
            type="checkbox"
            value=""
            defaultChecked
            ref={allRef}
            onChange={handleAllChange}
          /> All
        </label>
        {categories.map((cat, i) => (
          <label key={cat.id}>
            <input
              name="cat"
              type="checkbox"
              value={cat.id}
              ref={el => { catRefs.current[i] = el }}
              onChange={handleCatChange}
            /> {cat.name}
          </label>
        ))}
      </p>
      <p id="subm">
        <input type="submit" value="Pirate Search" style={{ fontSize: 11, fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }} />
        {' '}
        <input type="submit" name="lucky" value="I'm Feeling Lucky" style={{ fontSize: 11, fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }} />
      </p>
    </>
  )
}
