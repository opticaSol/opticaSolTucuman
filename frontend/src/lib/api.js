import axios from 'axios';
import { useUserStore } from '../store/useUserStore';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function updateMe(payload) {
  const { data } = await api.put('/auth/me', payload);
  return data;
}

export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data;
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function fetchRelatedProducts(id) {
  const { data } = await api.get(`/products/${id}/relacionados`);
  return data;
}

export async function fetchFilterOptions() {
  const { data } = await api.get('/products/filtros/opciones');
  return data;
}

export async function fetchActivePromotions() {
  const { data } = await api.get('/promotions/active');
  return data;
}

export async function fetchDashboardStats() {
  const { data } = await api.get('/admin/dashboard');
  return data;
}

export async function fetchAdminProducts(params = {}) {
  const { data } = await api.get('/admin/products', { params });
  return data;
}

export async function fetchAdminProduct(id) {
  const { data } = await api.get(`/admin/products/${id}`);
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post('/admin/products', payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
}

export async function fetchAdminPromotions(params = {}) {
  const { data } = await api.get('/admin/promotions', { params });
  return data;
}

export async function fetchAdminPromotion(id) {
  const { data } = await api.get(`/admin/promotions/${id}`);
  return data;
}

export async function createPromotion(payload) {
  const { data } = await api.post('/admin/promotions', payload);
  return data;
}

export async function updatePromotion(id, payload) {
  const { data } = await api.put(`/admin/promotions/${id}`, payload);
  return data;
}

export async function deletePromotion(id) {
  const { data } = await api.delete(`/admin/promotions/${id}`);
  return data;
}

export async function uploadImage(file, tipo = 'productos') {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`/admin/uploads?tipo=${tipo}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function createOrder(items, telefono) {
  const { data } = await api.post('/orders', { items, telefono });
  return data;
}

export async function fetchOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function deleteOrder(id) {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
}

export async function simulateOrderPayment(id, aprobado) {
  const { data } = await api.post(`/orders/${id}/simular`, { aprobado });
  return data;
}

export async function fetchMyOrders(params = {}) {
  const { data } = await api.get('/orders/mine', { params });
  return data;
}

export async function fetchAdminOrders(params = {}) {
  const { data } = await api.get('/admin/orders', { params });
  return data;
}

export async function updateOrderStatus(id, estado) {
  const { data } = await api.put(`/admin/orders/${id}/estado`, { estado });
  return data;
}

export async function updateAdminOrder(id, payload) {
  const { data } = await api.put(`/admin/orders/${id}`, payload);
  return data;
}

export async function deleteAdminOrder(id) {
  const { data } = await api.delete(`/admin/orders/${id}`);
  return data;
}

export async function submitReceta({ nombre, contacto, comentario, archivo }) {
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('contacto', contacto);
  if (comentario) formData.append('comentario', comentario);
  formData.append('archivo', archivo);

  const { data } = await api.post('/recetas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function fetchAdminRecetas(params = {}) {
  const { data } = await api.get('/admin/recetas', { params });
  return data;
}

export async function updateRecetaEstado(id, estado) {
  const { data } = await api.put(`/admin/recetas/${id}/estado`, { estado });
  return data;
}

export async function updateReceta(id, payload) {
  const { data } = await api.put(`/admin/recetas/${id}`, payload);
  return data;
}

export async function deleteReceta(id) {
  const { data } = await api.delete(`/admin/recetas/${id}`);
  return data;
}

export default api;
