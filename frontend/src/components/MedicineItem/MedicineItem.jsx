import React from 'react'
import './MedicineItem.css'
import { useCart } from '../../context/CartContext'

const MedicineItem = ({ medicine }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart()
  const quantity = getItemQuantity(medicine.id)

  return (
    <div className='medicine-item'>
      <div className='medicine-details'>
        <h3 className='med-name'>{medicine.medicine_name}</h3>
        <p className='med-brand'>by {medicine.brand}</p>
        <p className='med-composition'>{medicine.composition?.substring(0, 80)}</p>

        <div className='med-meta'>
          <span className='pack-info'>{medicine.pack_size}</span>
          {medicine.popularity > 80 && <span className='popularity-tag'>🔥 Popular</span>}
        </div>

        <div className='med-bottom'>
          <span className='med-price'>₹{medicine.mrp}</span>
          <div className='quantity-controls'>
            <button onClick={() => removeFromCart(medicine)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart(medicine)}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicineItem
