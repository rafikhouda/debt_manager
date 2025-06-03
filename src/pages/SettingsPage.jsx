import React from 'react';
    import { motion } from 'framer-motion';
    import PinSettings from '@/components/settings/PinSettings';
    import CurrencySettings from '@/components/settings/CurrencySettings';
    import DataManagementSettings from '@/components/settings/DataManagementSettings';
    import ContactSettings from '@/components/settings/ContactSettings';

    const DEFAULT_CURRENCY = 'DZD';

    const SettingsPage = ({ setIsPinEnabled, setStoredPin, isPinCurrentlyEnabled }) => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

      return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 max-w-2xl mx-auto">
          <motion.h1 variants={itemVariants} className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            الإعدادات
          </motion.h1>

          <motion.div variants={itemVariants}>
            <PinSettings 
              setIsPinEnabled={setIsPinEnabled} 
              setStoredPin={setStoredPin} 
              isPinCurrentlyEnabled={isPinCurrentlyEnabled}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencySettings defaultCurrency={DEFAULT_CURRENCY} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ContactSettings />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <DataManagementSettings />
          </motion.div>
        </motion.div>
      );
    };

    export default SettingsPage;
