import cart_icon from './cart-plus-solid-full.svg'
import search_icon from './search-solid.svg'
import logo from './logo.png'
import header_image from './header_image.jpeg'
import pain_relief from './pain-relief.jpg'
import cold_cough from './cold-cough.jpg'
import antibiotics from './antibiotics.png'
import vitamins from './vitamins.jpg'
import digestive from './digestive.jpg'
import skincare from './skincare.jpg'
import anti_inflammatory from './anti-inflammatory.jpg'
import others from './others.jpg'

export const API_URL = 'http://localhost:5000/api'

export const assets = {
    logo,
    cart_icon,
    search_icon,
    header_image,
    categories: {
        pain_relief,
        cold_cough,
        antibiotics,
        vitamins,
        digestive,
        skincare,
        anti_inflammatory,
        others
    }
}

export const categories_list = [
  {
    category_name: "Pain Relief & Fever",
    category_image: pain_relief,
  },
  {
    category_name: "Cold & Cough",
    category_image: cold_cough,
  },
  {
    category_name: "Antibiotics",
    category_image: antibiotics,
  },
  {
    category_name: "Vitamins & Supplements",
    category_image: vitamins,
  },
  {
    category_name: "Digestive Health",
    category_image: digestive,
  },
  {
    category_name: "Skin Care",
    category_image: skincare,
  },
  {
    category_name: "Anti-inflammatory",
    category_image: anti_inflammatory,
  },
  {
    category_name: "Other",
    category_image: others,
  },
];

