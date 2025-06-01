import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import DashboardPage from '@/pages/DashboardPage';
    import DebtsPage from '@/pages/DebtsPage';
    import PeoplePage from '@/pages/PeoplePage';
    import TransactionsPage from '@/pages/TransactionsPage';
    import SettingsPage from '@/pages/SettingsPage';
    import PinLockPage from '@/pages/PinLockPage';
    import { Toaster } from '@/components/ui/toaster';
    import { useToast } from '@/components/ui/use-toast';
    import { useLocalStorage } from '@/hooks/useLocalStorage';

    const App = () => {
      const [isPinEnabled, setIsPinEnabled] = useLocalStorage('isPinEnabled', false);
      const [storedPin, setStoredPin] = useLocalStorage('appPin', '');
      const [isAuthenticated, setIsAuthenticated] = useState(!isPinEnabled); 
      const { toast } = useToast();

      useEffect(() => {
        if (isPinEnabled && !storedPin) {
          setIsPinEnabled(false); 
          toast({
            title: "تنبيه",
            description: "تم تعطيل قفل PIN لأنه لم يتم تعيين PIN.",
            variant: "destructive",
          });
        }
        setIsAuthenticated(!isPinEnabled || !storedPin);
      }, [isPinEnabled, storedPin, setIsPinEnabled, toast]);

      const handlePinSuccess = () => {
        setIsAuthenticated(true);
        toast({
          title: "نجاح",
          description: "تم إلغاء قفل التطبيق بنجاح.",
        });
      };

      if (isPinEnabled && !isAuthenticated) {
        return (
          <Router>
            <PinLockPage 
              storedPin={storedPin} 
              onPinSuccess={handlePinSuccess} 
              onForgotPin={() => {
                setIsPinEnabled(false);
                setStoredPin('');
                setIsAuthenticated(true);
                toast({
                  title: "تم إعادة تعيين PIN",
                  description: "تم تعطيل قفل PIN. يمكنك تعيين PIN جديد من الإعدادات.",
                  variant: "default",
                });
              }}
            />
            <Toaster />
          </Router>
        );
      }

      return (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/debts" element={<DebtsPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/settings" element={<SettingsPage setIsPinEnabled={setIsPinEnabled} setStoredPin={setStoredPin} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      );
    };

    export default App;