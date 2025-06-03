import React, { useState, useEffect } from 'react';
    import { Lock, Save } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const PinSettings = ({ setIsPinEnabled: setAppPinEnabledStatus, setStoredPin: setAppStoredPin, isPinCurrentlyEnabled }) => {
      const [pinInput, setPinInput] = useState('');
      const [confirmPinInput, setConfirmPinInput] = useState('');
      const [isPinSwitchOn, setIsPinSwitchOn] = useState(isPinCurrentlyEnabled);
      
      const [storedPin, setStoredPinInLocalStorage] = useLocalStorage('appPin', '');
      const { toast } = useToast();

      useEffect(() => {
        setIsPinSwitchOn(isPinCurrentlyEnabled);
        if (isPinCurrentlyEnabled && storedPin) {
          setPinInput(storedPin);
          setConfirmPinInput(storedPin);
        } else if (!isPinCurrentlyEnabled) {
          setPinInput('');
          setConfirmPinInput('');
        }
      }, [isPinCurrentlyEnabled, storedPin]);

      const handlePinToggle = (checked) => {
        if (checked && !storedPin) {
          toast({ title: "تنبيه", description: "يرجى حفظ PIN أولاً قبل تفعيله.", variant: "default" });
          setIsPinSwitchOn(false); 
          return;
        }
        setIsPinSwitchOn(checked);
        setAppPinEnabledStatus(checked);
        toast({ title: "نجاح", description: `تم ${checked ? 'تفعيل' : 'تعطيل'} قفل PIN.` });
      };

      const handleSavePin = () => {
        if (pinInput.length < 4) {
          toast({ title: "خطأ", description: "يجب أن يتكون PIN من 4 أرقام على الأقل.", variant: "destructive" });
          return;
        }
        if (pinInput !== confirmPinInput) {
          toast({ title: "خطأ", description: "رمزي PIN غير متطابقين.", variant: "destructive" });
          return;
        }
        
        setStoredPinInLocalStorage(pinInput);
        setAppStoredPin(pinInput); 
        
        if (!isPinSwitchOn) {
            toast({ title: "نجاح", description: "تم حفظ PIN بنجاح. يمكنك تفعيله الآن." });
        } else {
            setAppPinEnabledStatus(true); 
            toast({ title: "نجاح", description: "تم تحديث PIN وتفعيله بنجاح." });
        }
      };
      
      const handleClearPin = () => {
        setPinInput('');
        setConfirmPinInput('');
        setStoredPinInLocalStorage('');
        setAppStoredPin('');
        setIsPinSwitchOn(false);
        setAppPinEnabledStatus(false);
        toast({ title: "نجاح", description: "تم مسح PIN وتعطيل القفل." });
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
                checked={isPinSwitchOn}
                onCheckedChange={handlePinToggle}
                disabled={!storedPin && pinInput.length < 4} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">رقم PIN (4 أرقام على الأقل)</Label>
              <Input 
                id="pin" 
                type="password" 
                value={pinInput} 
                onChange={(e) => setPinInput(e.target.value)} 
                maxLength={20} 
                placeholder="••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pin">تأكيد رقم PIN</Label>
              <Input 
                id="confirm-pin" 
                type="password" 
                value={confirmPinInput} 
                onChange={(e) => setConfirmPinInput(e.target.value)} 
                maxLength={20}
                placeholder="••••"
              />
            </div>
            <Button onClick={handleSavePin} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
              <Save className="mr-2 rtl:ml-2 h-4 w-4"/> {storedPin ? 'تحديث PIN' : 'حفظ PIN'}
            </Button>
            {storedPin && (
                 <Button onClick={handleClearPin} variant="destructive" className="w-full">
                    مسح PIN وتعطيل القفل
                </Button>
            )}
          </CardContent>
        </Card>
      );
    };
    export default PinSettings;
