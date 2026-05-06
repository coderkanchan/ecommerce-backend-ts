"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Users', path: '/admin/users' },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen sticky top-0 border-r border-gray-800 p-6">

      <h2 className="text-xl font-bold text-blue-500 mb-10">Admin Panel</h2>
      
      <nav className="flex flex-col gap-10 ">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block p-3 rounded-lg transition ${pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;