import React from 'react';
    import { motion } from 'framer-motion';

    const Footer = () => {
      return (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-secondary/50 text-secondary-foreground py-6 text-center"
        >
          <div className="container mx-auto px-4">
            <p className="text-sm">
              تم تطوير هذا البرنامج لتسهيل إدارة ديونك
            </p>
            <p className="text-xs mt-1">
              جميع البيانات محفوظة محلياً على جهازك
            </p>
          </div>
        </motion.footer>
      );
    };

    export default Footer;