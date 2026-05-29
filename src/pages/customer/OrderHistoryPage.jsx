import { useEffect, useState } from "react";
import { ShoppingBag, Clock, ChevronRight, Package, Calendar, MapPin } from "lucide-react";
import { orderService } from "../../services/orderService";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-green-500";
      case "PENDING":
      case "PREPARING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] px-4 py-10 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <main className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#e4002b]">
            Your Journey
          </p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-6xl tracking-wider">
            ORDER HISTORY
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#242424] border-t-[#e4002b]"></div>
            <p className="mt-4 font-black uppercase tracking-widest text-gray-500">Loading your feast history...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-4 border-[#242424] bg-white p-8 text-center shadow-[8px_8px_0_#242424]">
            <p className="text-xl font-bold text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border-2 border-[#242424] bg-[#242424] px-6 py-2 font-['Bebas_Neue'] text-xl tracking-widest text-white hover:bg-[#e4002b] transition-colors"
            >
              RETRY
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-4xl border-4 border-[#242424] bg-white p-12 text-center shadow-[12px_12px_0_#242424]">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">NO ORDERS YET</h2>
            <p className="mt-2 font-bold text-gray-500 uppercase tracking-wide">Time to start your Serious Fried Chicken adventure!</p>
            <a 
              href="/menu"
              className="mt-8 inline-block rounded-full border-2 border-[#242424] bg-[#e4002b] px-10 py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_#242424]"
            >
              ORDER NOW
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="group relative overflow-hidden rounded-3xl border-4 border-[#242424] bg-white p-6 shadow-[8px_8px_0_#242424] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_#242424]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#242424] text-white ${getStatusColor(order.status)} shadow-[4px_4px_0_#242424]`}>
                      <Package size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Bebas_Neue'] text-2xl tracking-wider">ORDER #{order._id?.slice(-6).toUpperCase()}</span>
                        <span className={`rounded-full border-2 border-[#242424] px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-white ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {order.type === "delivery" && <span className="flex items-center gap-1 text-[#e4002b]"><MapPin size={14} /> DELIVERY</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t-2 border-dashed border-gray-200 pt-4 md:border-none md:pt-0">
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Price</p>
                      <p className="font-['Bebas_Neue'] text-4xl text-[#e4002b]">฿{order.totalPrice?.toLocaleString()}</p>
                    </div>
                    <ChevronRight size={32} className="ml-4 text-gray-300 transition-colors group-hover:text-[#242424]" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {order.orderList?.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="rounded-lg border-2 border-[#242424] bg-[#eeeeee] px-3 py-1 text-xs font-bold">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                  {order.orderList?.length > 3 && (
                    <span className="rounded-lg border-2 border-[#242424] bg-white px-3 py-1 text-xs font-black">
                      +{order.orderList.length - 3} MORE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
