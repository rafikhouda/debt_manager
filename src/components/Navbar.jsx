import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { Home, ListChecks, Users, History, Settings, Landmark } from 'lucide-react';
    import { motion } from 'framer-motion';

    const navItems = [
      { to: '/', label: 'الرئيسية', icon: Home },
      { to: '/debts', label: 'الديون', icon: ListChecks },
      { to: '/people', label: 'الأشخاص', icon: Users },
      { to: '/transactions', label: 'المعاملات', icon: History },
      { to: '/settings', label: 'الإعدادات', icon: Settings },
    ];

    const Navbar = () => {
      return (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="bg-primary/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <Landmark className="h-10 w-10 text-primary-foreground animate-pulse" />
                <span className="text-2xl font-bold text-primary-foreground">مدير الديون</span>
              </NavLink>
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out
                       ${isActive 
                         ? 'bg-primary-foreground text-primary shadow-md' 
                         : 'text-primary-foreground hover:bg-primary-foreground/20'
                       }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-2 rtl:ml-2" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="md:hidden">
              </div>
            </div>
          </div>
          <div className="md:hidden bg-primary/80">
             <div className="flex justify-around py-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to + "-mobile"}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex flex-col items-center px-2 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ease-in-out
                       ${isActive 
                         ? 'text-accent scale-110' 
                         : 'text-primary-foreground hover:text-accent/80'
                       }`
                    }
                  >
                    <item.icon className="w-6 h-6 mb-1" />
                    {item.label}
                  </NavLink>
                ))}
             </div>
          </div>
        </motion.nav>
      );
    };

    export default Navbar;