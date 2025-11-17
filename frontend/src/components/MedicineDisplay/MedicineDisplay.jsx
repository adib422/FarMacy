import React, { useState, useEffect, useRef } from 'react'
import './MedicineDisplay.css'
import MedicineItem from '../MedicineItem/MedicineItem'
import { getMedicinesByCategory, getAllMedicines, searchMedicines } from '../../services/api'

const MedicineDisplay = ({ category }) => {
  const [medicines, setMedicines] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMedicines, setTotalMedicines] = useState(0)
  const [fade, setFade] = useState(false) // fade animation

  // Ref for scrolling to the start of the medicine section
  const medicineSectionRef = useRef(null)

  useEffect(() => {
    setPage(1) // Reset to page 1 when category changes
    fetchMedicines()
  }, [category])

  useEffect(() => {
    fetchMedicines()
  }, [page])

  const fetchMedicines = async () => {
    setLoading(true)
    let result
    if (category === 'All') {
      result = await getAllMedicines(page, 20)
    } else {
      result = await getMedicinesByCategory(category, page, 20)
    }

    if (result.success) {
      setMedicines(result.data)
      setTotalPages(result.pagination.totalPages)
      setTotalMedicines(result.pagination.total)

      // Trigger fade animation
      setFade(true)
      setTimeout(() => setFade(false), 400)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true)
      const result = await searchMedicines(searchTerm, 1, 20)
      if (result.success) {
        setMedicines(result.data)
        setTotalPages(result.pagination.totalPages)
        setTotalMedicines(result.pagination.total)
        setPage(1)

        // Trigger fade animation
        setFade(true)
        setTimeout(() => setFade(false), 400)
      }
      setLoading(false)
    } else {
      setPage(1)
      fetchMedicines()
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      medicineSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      medicineSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        })
    }
  }

  if (loading) {
    return <div className='medicine-display'><p>Loading medicines...</p></div>
  }

  return (
    <div className='medicine-display' ref={medicineSectionRef}>
      <div className='display-header'>
        <h2>{category === 'All' ? 'All Medicines' : category}</h2>
        <p className='medicine-count'>
          Showing {medicines.length} of {totalMedicines} medicines (Page {page} of {totalPages})
        </p>
      </div>

      <div className='search-filter-bar'>
        <input
          type='text'
          placeholder='Search medicines by name or brand...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='search-input'
        />
        <button onClick={handleSearch} className='search-btn-main'>Search</button>
      </div>

      <div className={`medicines-list ${fade ? 'fade-in' : ''}`}>
        {medicines.length > 0 ? (
          medicines.map(med => <MedicineItem key={med.id} medicine={med} />)
        ) : (
          <div className='no-results'><p>No medicines found</p></div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='pagination-controls'>
          <button 
            onClick={handlePrevPage} 
            disabled={page === 1}
            className='pagination-btn'
          >
            ← Previous
          </button>
          
          <div className='page-info'>
            Page {page} of {totalPages}
          </div>
          
          <button 
            onClick={handleNextPage} 
            disabled={page === totalPages}
            className='pagination-btn'
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default MedicineDisplay
