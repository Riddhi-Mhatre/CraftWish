import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, IndianRupee, AlertTriangle, Trash2, Edit, TrendingUp, Activity } from 'lucide-react';
import { getDashboardReports } from '../services/report.service';
import { getAllOrders, updateOrderStatus } from '../services/order.service';
import { getProducts, deleteProduct, updateProduct } from '../services/product.service';
import { getCategories, deleteCategory, updateCategory } from '../services/category.service';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';

const COLORS = ['#8B5E3C', '#A67C52', '#C19A6B', '#D9B48F', '#F5DDC4'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5E3C] to-orange-500">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Manage your store and view business analytics.</p>
        </div>
        <div className="flex bg-gray-50 rounded-xl p-1.5 border shadow-inner w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['overview', 'orders', 'products', 'categories'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-bold capitalize transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#8B5E3C] shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'categories' && <CategoriesTab />}
    </div>
  );
};

const OverviewTab = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardReports().then(res => setReports(res.data)).catch(() => toast.error("Failed to load overview")).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5E3C]"></div>
    </div>
  );
  if (!reports) return null;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10"><IndianRupee className="w-24 h-24 text-orange-600" /></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-xl mr-4 text-white shadow-lg shadow-orange-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-extrabold text-gray-800">
                ₹{reports.monthlySales.reduce((acc, curr) => acc + curr.totalSales, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Package className="w-24 h-24 text-blue-600" /></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl mr-4 text-white shadow-lg shadow-blue-200">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-extrabold text-gray-800">
                {reports.monthlySales.reduce((acc, curr) => acc + curr.ordersCount, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-red-50 p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24 text-red-600" /></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-xl mr-4 text-white shadow-lg shadow-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Low Stock</p>
              <p className="text-3xl font-extrabold text-gray-800">{reports.lowStockProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-24 h-24 text-yellow-600" /></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl mr-4 text-white shadow-lg shadow-yellow-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Top Customers</p>
              <p className="text-3xl font-extrabold text-gray-800">{reports.topCustomers.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 font-heading flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#8B5E3C]" />
            Monthly Sales Revenue
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="_id" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="totalSales" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 font-heading flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#8B5E3C]" />
            Revenue by Category
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reports.revenueByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="revenue" nameKey="_id" label={({ _id }) => _id}>
                  {reports.revenueByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-lg text-gray-800">🏆 Best Selling Products</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {reports.bestSellingProducts.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-orange-50 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold group-hover:scale-110 transition-transform">
                    {item.totalSold}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{item.name || 'Unknown Product'}</p>
                    <p className="text-xs text-gray-500">units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#8B5E3C]">₹{(item.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
            {reports.bestSellingProducts.length === 0 && <p className="p-8 text-center text-gray-500">No data</p>}
          </div>
        </div>

        {/* Top Spenders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-lg text-gray-800">⭐ Top Customers</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {reports.topCustomers.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm group-hover:scale-110 transition-transform">
                    {item.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{item.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{item.ordersCount} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">₹{(item.totalSpent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
            {reports.topCustomers.length === 0 && <p className="p-8 text-center text-gray-500">No data</p>}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 border-b bg-gradient-to-r from-red-50 to-white">
            <h2 className="font-bold text-lg text-red-700 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" /> Low Stock Alerts
            </h2>
          </div>
          <div className="divide-y divide-red-50">
            {reports.lowStockProducts.map(product => (
              <div key={product._id} className="p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-12 transition-transform">!</div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold shadow-sm">
                    {product.stock} left
                  </span>
                </div>
              </div>
            ))}
            {reports.lowStockProducts.length === 0 && <p className="p-8 text-center text-green-600 font-medium">✅ Stock levels look good!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated!");
      fetchOrders();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold">Loading orders...</div>;
  if (orders.length === 0) return <div className="text-center py-20 text-gray-500">No orders found.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-white border-b text-gray-600">
              <th className="p-4 font-bold">Order ID</th>
              <th className="p-4 font-bold">Customer</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Total</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="p-4 text-sm font-mono text-gray-500">#{order._id.substring(18, 24)}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-800">{order.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td className="p-4 font-bold text-[#8B5E3C]">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#8B5E3C] outline-none bg-white cursor-pointer hover:border-[#8B5E3C] transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ limit: 1000 }); // fetch all for admin
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        fetchProducts();
      } catch (e) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = async (product) => {
    const newPrice = window.prompt(`Enter new price for ${product.name}:`, product.price);
    if (!newPrice) return;
    try {
      // Send the full object to satisfy the backend validator
      const updatedData = {
        ...product,
        price: Number(newPrice),
        category: product.category._id // Map category back to its ID
      };
      await updateProduct(product._id, updatedData);
      toast.success("Product updated");
      fetchProducts();
    } catch (e) {
      toast.error("Failed to update product");
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold">Loading products...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="font-bold text-xl text-gray-800">Manage Products</h2>
          <p className="text-sm text-gray-500 mt-1">View, edit, or remove your catalog items.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b text-gray-600 bg-gray-50/50">
              <th className="p-4 font-bold">Image</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="p-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                    <img src={product.images?.[0]?.url || 'https://via.placeholder.com/50'} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-800">{product.name}</td>
                <td className="p-4 font-bold text-[#8B5E3C]">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-sm`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 p-2 hover:bg-blue-100 hover:shadow-sm rounded-lg transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 p-2 hover:bg-red-100 hover:shadow-sm rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted");
        fetchCategories();
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to delete category");
      }
    }
  };

  const handleEdit = async (cat) => {
    const newName = window.prompt("Enter new category name:", cat.name);
    if (!newName) return;
    try {
      await updateCategory(cat._id, { name: newName });
      toast.success("Category updated");
      fetchCategories();
    } catch (e) {
      toast.error("Failed to update category");
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold">Loading categories...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="font-bold text-xl text-gray-800">Manage Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Organize your store's taxonomy.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b text-gray-600 bg-gray-50/50">
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Description</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                <td className="p-4 text-sm text-gray-600 max-w-md truncate">{cat.description}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 p-2 hover:bg-blue-100 hover:shadow-sm rounded-lg transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 p-2 hover:bg-red-100 hover:shadow-sm rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
