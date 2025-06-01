import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Lock, Delete, Fingerprint } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';

    const PinLockPage = ({ storedPin, onPinSuccess, onForgotPin }) => {
      const [pin, setPin] = useState('');
      const [error, setError] = useState('');
      const { toast } = useToast();
      const inputRefs = useRef([]);

      useEffect(() => {
        inputRefs.current[0]?.focus();
      }, []);

      const handlePinChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return; 

        const newPin = pin.split('');
        newPin[index] = value;
        setPin(newPin.join('').slice(0, 4));

        if (value && index < 3) {
          inputRefs.current[index + 1]?.focus();
        }
      };
      
      const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };

      const handleSubmit = () => {
        if (pin === storedPin) {
          onPinSuccess();
        } else {
          setError('رقم PIN غير صحيح. حاول مرة أخرى.');
          setPin('');
          inputRefs.current[0]?.focus();
          toast({
            title: "خطأ في المصادقة",
            description: "رقم PIN الذي أدخلته غير صحيح.",
            variant: "destructive",
          });
        }
      };
      
      useEffect(() => {
        if (pin.length === 4) {
          handleSubmit();
        }
      }, [pin]);


      const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } },
      };

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/80 via-background to-secondary/50 p-4 text-foreground">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md p-8 space-y-8 bg-card shadow-2xl rounded-2xl"
          >
            <div className="text-center">
              <Lock className="mx-auto h-16 w-16 text-primary animate-pulse" />
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary">
                إلغاء قفل التطبيق
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                الرجاء إدخال رقم PIN الخاص بك للمتابعة.
              </p>
            </div>

            <div dir="ltr" className="flex justify-center space-x-3">
              {[0, 1, 2, 3].map(i => (
                <Input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="password"
                  maxLength="1"
                  value={pin[i] || ''}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-16 h-16 text-center text-3xl font-semibold rounded-lg border-2 
                              ${error ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'} 
                              transition-all duration-200 ease-in-out shadow-sm bg-background`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            
            {error && <p className="text-center text-sm text-destructive animate-shake">{error}</p>}

            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={pin.length !== 4}
                className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground"
              >
                إلغاء القفل
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setPin('');
                  setError('');
                  inputRefs.current[0]?.focus();
                }}
                className="text-muted-foreground hover:text-primary"
              >
                مسح الإدخال
              </Button>
            </div>
            
            <div className="text-center">
              <Button variant="link" onClick={onForgotPin} className="text-sm text-muted-foreground hover:text-primary">
                هل نسيت رقم PIN؟
              </Button>
            </div>
          </motion.div>
        </div>
      );
    };

    export default PinLockPage;