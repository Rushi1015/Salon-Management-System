import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from './store';
import Layout from './parts/Layout';
import Home from './component/Home';
import BookAppointment from './component/BookAppointment';
import Contact from './component/Contact';
import About from './component/About';
import Login from './component/Login';
import Register from './component/Register';
import ForgotPassword from './component/ForgotPassword';
import AppointmentHistory from './component/AppointmentHistory';
import OrderHistory from './component/OrderHistory';
import Services from './component/Services';

import Store from './component/Store';
import Cart from './component/Cart';
import Checkout from './component/Checkout';
import Profile from './component/Profile';
import AdminLayout from './parts/AdminLayout';
import AdminDashboard from './component/admin/AdminDashboard';
import StaffManagement from './component/admin/StaffManagement';
import AppointmentAdmin from './component/admin/AppointmentAdmin';
import InventoryManagement from './component/admin/InventoryManagement';
import WageManagement from './component/admin/WageManagement';
import ServicesAdmin from './component/admin/ServicesAdmin';
import AnalyticsDashboard from './component/admin/AnalyticsDashboard';
import OrdersAdmin from './component/admin/OrdersAdmin';
import ProductsAdmin from './component/admin/ProductsAdmin';
import { ProtectedRoute, RoleRoute } from './component/common/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="services" element={<Services />} />
            <Route path="store" element={<Store />} />
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookappointment"
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointments"
              element={
                <ProtectedRoute>
                  <AppointmentHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <RoleRoute roles={['Admin', 'Receptionist', 'Barber']}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AppointmentAdmin />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="wages" element={<WageManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
