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
      const [isPinEnabledSetting, setIsPinEnabledSetting] = useLocalStorage('isPinEnabled', false);
      const [storedPin, setStoredPin] = useLocalStorage('appPin', '');
      
      const [isActuallyPinLocked, setIsActuallyPinLocked] = useState(false);
      const [isAuthenticated, setIsAuthenticated] = useState(false); 

      const { toast } = useToast();

      useEffect(() => {
        const pinIsEnabledAndSet = isPinEnabledSetting && !!storedPin;
        setIsActuallyPinLocked(pinIsEnabledAndSet);
        setIsAuthenticated(!pinIsEnabledAndSet);
      }, [isPinEnabledSetting, storedPin]);
      
      useEffect(() => {
        if (isPinEnabledSetting && !storedPin) {
          setIsPinEnabledSetting(false); 
          setIsActuallyPinLocked(false);
          setIsAuthenticated(true);
          toast({
            title: "تنبيه",
            description: "تم تعطيل قفل PIN لأنه لم يتم تعيين PIN.",
            variant: "destructive",
          });
        }
      }, [isPinEnabledSetting, storedPin, setIsPinEnabledSetting, toast]);

      const handlePinSuccess = () => {
        setIsAuthenticated(true);
        setIsActuallyPinLocked(false); 
        toast({
          title: "نجاح",
          description: "تم إلغاء قفل التطبيق بنجاح.",
        });
      };

      const handleSetIsPinEnabled = (enabled) => {
        setIsPinEnabledSetting(enabled);
        if (!enabled) {
            setIsAuthenticated(true);
            setIsActuallyPinLocked(false);
        } else if (enabled && !!storedPin) {
            setIsAuthenticated(false);
            setIsActuallyPinLocked(true);
        } else if (enabled && !storedPin) {
            setIsAuthenticated(true);
            setIsActuallyPinLocked(false);
             toast({
                title: "تنبيه",
                description: "يرجى تعيين PIN في الإعدادات لتفعيل القفل.",
                variant: "default"
            });
             setIsPinEnabledSetting(false);
        }
      };

      const handleSetStoredPin = (newPin) => {
        setStoredPin(newPin);
        if (isPinEnabledSetting && !newPin) {
          setIsPinEnabledSetting(false);
          setIsActuallyPinLocked(false);
          setIsAuthenticated(true);
        } else if (isPinEnabledSetting && newPin) {
           setIsActuallyPinLocked(true);
           setIsAuthenticated(false);
        }
      };
      
      const handleForgotPin = () => {
        setIsPinEnabledSetting(false);
        setStoredPin('');
        setIsAuthenticated(true);
        setIsActuallyPinLocked(false);
        toast({
          title: "تم إعادة تعيين PIN",
          description: "تم تعطيل قفل PIN. يمكنك تعيين PIN جديد من الإعدادات.",
          variant: "default",
        });
      };


      if (isActuallyPinLocked && !isAuthenticated) {
        return (
          <Router>
            <PinLockPage 
              storedPin={storedPin} 
              onPinSuccess={handlePinSuccess} 
              onForgotPin={handleForgotPin}
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
              <Route path="/settings" element={<SettingsPage setIsPinEnabled={handleSetIsPinEnabled} setStoredPin={handleSetStoredPin} isPinCurrentlyEnabled={isPinEnabledSetting} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      );
    };

    export default App;
