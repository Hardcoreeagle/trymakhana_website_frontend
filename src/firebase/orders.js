// src/firebase/orders.js — now uses backend API (MySQL)
import {
  placeOrderAPI, fetchAllOrdersAPI, fetchOrderByIdAPI,
  fetchOrdersByEmailAPI, updateOrderStatusAPI,
  updateCourierInfoAPI, updatePaymentStatusAPI,
} from '../api'

export async function placeOrderFirestore(orderData) {
  const result = await placeOrderAPI(orderData)
  return result.id
}

export async function fetchAllOrdersFirestore() {
  return fetchAllOrdersAPI()
}

export async function fetchOrderByIdFirestore(id) {
  return fetchOrderByIdAPI(id)
}

export async function fetchOrdersByEmailFirestore(email) {
  return fetchOrdersByEmailAPI(email)
}

export async function updateOrderStatusFirestore(id, status) {
  return updateOrderStatusAPI(id, status)
}

export async function updateCourierInfoFirestore(id, info) {
  return updateCourierInfoAPI(id, info)
}

export async function updatePaymentStatusFirestore(id, paymentStatus) {
  return updatePaymentStatusAPI(id, paymentStatus)
}
