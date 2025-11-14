'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mountain, Building2, Grid3x3 } from 'lucide-react';

export default function CategoryNav() {
  const pathname = usePathname();

  const categories = [
    {
      href: '/propiedades',
      label: 'Todas',
      icon: Grid3x3,
      active: pathname === '/propiedades',
    },
    {
      href: '/propiedades/terrenos',
      label: 'Terrenos',
      icon: Mountain,
      active: pathname === '/propiedades/terrenos',
    },
    {
      href: '/propiedades/casas',
      label: 'Casas',
      icon: Home,
      active: pathname === '/propiedades/casas',
    },
    {
      href: '/propiedades/departamentos',
      label: 'Departamentos',
      icon: Building2,
      active: pathname === '/propiedades/departamentos',
    },
  ];

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.href}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  category.active
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
