import React, { useState, useEffect } from 'react';
    import { Lock, Save } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const PinSettings = ({ setIsPinEnabled: setAppPinEnabled, setStoredPin: setAppStoredPin }) => {
      const [pin, setPin] = useState('');
      const [confirmPin, setConfirmPin] = useState('');
      const [isPinEnabled, setIsPinEnabled] = useLocalStorage('isPinEnabled', false);
      const [storedPin, setStoredPin] = useLocalStorage('appPin', '');
      const { toast } = useToast();

      useEffect(() => {
        if (isPinEnabled && storedPin) {
          setPin(storedPin);
          setConfirmPin(storedPin);
        } else {
          setPin('');
          setConfirmPin('');
        }
      }, [isPinEnabled, storedPin]);

      const handlePinToggle = (checked) => {
        if (checked) {
          if (!storedPin && !pin) { // Check if neither storedPin nor current pin input exists
            toast({ title: "تنبيه", description: "يرجى تعيين PIN أولاً قبل تفعيله.", variant: "default" });
            return;
          }
           if (!storedPin && pin && pin === confirmPin && pin.length >=4){
             // If no stored PIN, but user entered a valid new PIN and tries to enable
             setStoredPin(pin);
             setAppStoredPin(pin);
           } else if (!storedPin){
             toast({ title: "تنبيه", description: "يرجى تعيين PIN صالح أولاً قبل تفعيله.", variant: "default" });
             return;
           }
        }
        setIsPinEnabled(checked);
        setAppPinEnabled(checked);
        toast({ title: "نجاح", description: `تم ${checked ? 'تفعيل' : 'تعطيل'} قفل PIN.` });
      };

      const handleSavePin = () => {
        if (pin.length < 4) {
          toast({ title: "خطأ", description: "يجب أن يتكون PIN من 4 أرقام على الأقل.", variant: "destructive" });
          return;
        }
        if (pin !== confirmPin) {
          toast({ title: "خطأ", description: "رمزي PIN غير متطابقين.", variant: "destructive" });
          return;
        }
        setStoredPin(pin);
        setAppStoredPin(pin);
        
        if (!isPinEnabled) { // If PIN was not enabled, enable it now that a PIN is saved.
            setIsPinEnabled(true);
            setAppPinEnabled(true);
             toast({ title: "نجاح", description: "تم حفظ PIN بنجاح وتفعيله." });
        } else {
            toast({ title: "نجاح", description: "تم تحديث PIN بنجاح." });
        }
      };

      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Lock className="mr-2 rtl:ml-2 h-6 w-6" />
              أمان PIN
            </CardTitle>
            <CardDescription>
              قم بتأمين تطبيقك باستخدام رقم تعريف شخصي.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
              <Label htmlFor="pin-enable" className="text-base">تفعيل قفل PIN</Label>
              <Switch
                id="pin-enable"
                checked={isPinEnabled}
                onCheckedChange={handlePinToggle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">رقم PIN (4 أرقام على الأقل)</Label>
              <Input 
                id="pin" 
                type="password" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                maxLength={20} 
                placeholder="••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pin">تأكيد رقم PIN</Label>
              <Input 
                id="confirm-pin" 
                type="password" 
                value={confirmPin} 
                onChange={(e) => setConfirmPin(e.target.value)} 
                maxLength={20}
                placeholder="••••"
              />
            </div>
            <Button onClick={handleSavePin} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
              <Save className="mr-2 rtl:ml-2 h-4 w-4"/> {storedPin ? 'تحديث PIN' : 'حفظ وتفعيل PIN'}
            </Button>
          </CardContent>
        </Card>
      );
    };
    export default PinSettings;