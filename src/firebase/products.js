// src/firebase/products.js — now uses backend API (MySQL)
import { fetchProductsPublicAPI, fetchProductsAPI, saveProductAPI, deleteProductAPI, toggleProductAPI } from '../api'

export async function fetchPublicProductsFromFirestore() {
  return fetchProductsPublicAPI()
}

export async function fetchAllProductsFromFirestore() {
  return fetchProductsAPI()
}

export async function saveProductToFirestore(product) {
  return saveProductAPI(product)
}

export async function deleteProductFromFirestore(id) {
  return deleteProductAPI(id)
}

export async function toggleProductInFirestore(id, active) {
  return toggleProductAPI(id, active)
}
