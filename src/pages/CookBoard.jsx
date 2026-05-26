import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function CookBoard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("cooking"); // 'all', 'cooking', 'finished'
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getTableStatus = (orderList) => {
    if (orderList.every(item => item.status === "finished" || item.status === "cancel")) {
      return "finished";
    }
    if (orderList.some(item => item.status === "Cook")) {
      return "cooking";
    }
    return "inkitchen";
  };

  const filteredOrders = orders.filter((order) => {
    const status = getTableStatus(order.orderList);
    if (filter === "all") return true;
    if (filter === "cooking") return status === "cooking" || status === "inkitchen";
    if (filter === "finished") return status === "finished";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "finished": return "bg-green-100 border-green-500";
      case "cooking": return "bg-red-100 border-red-500";
      case "inkitchen": return "bg-blue-100 border-blue-500";
      default: return "bg-gray-100 border-gray-500";
    }
  };

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/item/${itemId}`, { status: newStatus });
      fetchOrders(); // Refresh data
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kitchen Display System</h1>
        <div className="flex gap-2">
          {["all", "cooking", "finished"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full capitalize font-medium transition ${
                filter === f 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "cooking" ? "In Cooking" : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map((order) => {
            const tableStatus = getTableStatus(order.orderList);
            return (
              <div 
                key={order._id} 
                className={`flex flex-col border-t-4 rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 bg-white ${getStatusColor(tableStatus)}`}
              >
                <div className="p-4 border-b bg-opacity-10 bg-black flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {order.type === "Onsite" ? order.customer.name : `Delivery: ${order.customer.name}`}
                    </h2>
                    <p className="text-xs text-gray-500">Order ID: {order._id.substring(order._id.length - 6)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    tableStatus === 'cooking' ? 'bg-red-500 text-white' : 
                    tableStatus === 'finished' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {tableStatus}
                  </span>
                </div>
                
                <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
                  {order.orderList.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-2 rounded bg-white bg-opacity-50 border border-gray-200">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">{item.name} x{item.quantity}</span>
                          <span className={`text-xs font-bold ${
                            item.status === 'Cook' ? 'text-red-600' : 
                            item.status === 'finished' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {item.status === 'InKitchen' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'Cook')}
                              className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                            >
                              Start Cooking
                            </button>
                          )}
                          {item.status === 'Cook' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'finished')}
                              className="text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Finish
                            </button>
                          )}
                          {item.status !== 'finished' && item.status !== 'cancel' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'cancel')}
                              className="text-[10px] bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          )}
                          {item.status === 'finished' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'InKitchen')}
                              className="text-[10px] bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500"
                            >
                              Redo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.customer.note && (
                  <div className="p-3 bg-yellow-50 text-xs text-yellow-800 italic border-t border-yellow-100">
                    Note: {order.customer.note}
                  </div>
                )}
                
                <div className="p-2 bg-gray-50 text-[10px] text-gray-400 text-center border-t">
                  Ordered: {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {filteredOrders.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <span className="text-5xl mb-4">🍳</span>
          <p className="text-xl">No orders in this category</p>
        </div>
      )}
    </div>
  );
}
