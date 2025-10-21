import React from 'react'
import './ExploreCategories.css'
import { categories_list } from '../../assets/assets'

const ExploreCategories = ({category,setCategory}) => {
  return (
    <div className='explore-categories' id='explore-categories'>
        <h1>Browse by Health Conditions</h1>
        <div className="explore-categories-list">
            {categories_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.category_name?"All":item.category_name)} key={index} className="explore-categories-list-item">
                        <img className={category===item.category_name?"active":""} src={item.category_image} alt="" />
                        <p>{item.category_name}</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ExploreCategories