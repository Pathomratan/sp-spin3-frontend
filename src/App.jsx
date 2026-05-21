import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbarmenu from "./component/Navbarmenu";
import CookBoard from "./pages/CookBoard";
import IndexPage from "./pages/customer/IndexPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/cashier/CheckoutPage";
import TableMap from "./pages/shared/TableMap";
import OrderList from "./pages/cashier/OrderList";
import OrderHistory from "./pages/cashier/OrderHistory";
import MenuPage from "./pages/customer/MenuPage";
import PaymentPage from "./pages/customer/PaymentPage";
import OrderPage from "./pages/customer/OrderPage";
import BookingPage from "./pages/customer/BookingPage";
// import DeliveryTracking from "./pages/customer/DeliveryTracking";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import ProtectedRoute from "./component/ProtectedRoute";
// นำเข้า UserContext เพื่อให้ปุ่ม Dev ใช้คำสั่ง setMyUserInfo ได้
import { UserContext } from "./context/userContext/UserContext";

// Component สำหรับ Dev Mode (จำลองการเข้าทุก role โดยไม่ต้อง log-in)
const DevRoleSwitcher = () => {
  // รับก้อน Context มาก่อน (อย่าเพิ่งแกะกล่อง)
  const userCtx = useContext(UserContext);
  // ป้องกันแอปพัง: ถ้าหา Context ไม่เจอ (userCtx เป็น undefined) ให้ซ่อนปุ่มไปเลย
  if (!userCtx) return null;

  // ถ้าไม่ใช่โหมด Dev (เช่น ตอน Build เอาขึ้นเว็บจริง) จะไม่เรนเดอร์โค้ดนี้เลย
  if (!import.meta.env.DEV) return null;
  // ถ้าเจอ Context ค่อยแกะกล่องเอา setMyUserInfo ออกมาใช้
  const { setMyUserInfo } = userCtx;

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-3 z-9999 flex gap-3 text-sm rounded-tl-xl border-t-2 border-l-2 border-[#e4002b] shadow-2xl backdrop-blur-sm">
      <span className="font-black text-yellow-400 font-['Bebas_Neue'] tracking-wider">
        DEV MODE :
      </span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold"
        onClick={() =>
          setMyUserInfo({ role: "customer", name: "Dev Customer" })
        }
      >
        Customer
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold"
        onClick={() => setMyUserInfo({ role: "cook", name: "Dev Cook" })}
      >
        Cook
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold"
        onClick={() => setMyUserInfo({ role: "cashier", name: "Dev Cashier" })}
      >
        Cashier
      </button>
      <span className="opacity-30">|</span>
      <button
        className="text-red-400 hover:text-red-500 transition-colors font-bold"
        onClick={() => setMyUserInfo(null)}
      >
        Clear
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Navbarmenu />
      <DevRoleSwitcher />

      <Routes>
        {/* PUBLIC ROUTES (ใครก็เข้าได้ ไม่ต้องล็อกอิน) */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER ROUTES (ต้องล็อกอิน และเป็น Customer) */}

        <Route
          path="/order"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />

        {/* COOK ROUTES */}
        <Route
          path="/cookBoard"
          element={
            <ProtectedRoute allowedRoles={["cook"]}>
              <CookBoard />
            </ProtectedRoute>
          }
        />

        {/* CASHIER ROUTES */}
        <Route
          path="/cashier/checkout"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/orders"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <OrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/history"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* SHARED ROUTES (เข้าได้มากกว่า 1 Role) */}
        <Route
          path="/shared/tables"
          element={
            <ProtectedRoute allowedRoles={["cashier", "cook"]}>
              <TableMap />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
