import React, { useState, useEffect } from 'react';
    import { DollarSign, Trash2, PlusCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const CurrencySettings = ({ defaultCurrency }) => {
      const [currencies, setCurrencies] = useLocalStorage('settingsCurrencies', [defaultCurrency, 'USD', 'EUR']);
      const [newCurrency, setNewCurrency] = useState('');
      const { toast } = useToast();

      const handleAddCurrency = () => {
        if (newCurrency.trim() === '') {
          toast({ title: "خطأ", description: "يرجى إدخال رمز عملة صالح.", variant: "destructive" });
          return;
        }
        const upperCaseCurrency = newCurrency.toUpperCase();
        if (currencies.includes(upperCaseCurrency)) {
          toast({ title: "خطأ", description: "هذه العملة موجودة بالفعل.", variant: "destructive" });
          return;
        }
        setCurrencies(prev => [...prev, upperCaseCurrency]);
        setNewCurrency('');
        toast({ title: "نجاح", description: `تمت إضافة العملة ${upperCaseCurrency}.` });
      };

      const handleRemoveCurrency = (currencyToRemove) => {
        if (currencies.length <= 1) {
          toast({ title: "خطأ", description: "يجب أن تحتفظ بعملة واحدة على الأقل.", variant: "destructive" });
          return;
        }
        if (currencyToRemove === defaultCurrency && currencies.includes(defaultCurrency)) {
            toast({ title: "خطأ", description: `لا يمكن إزالة العملة الافتراضية (${defaultCurrency}).`, variant: "destructive" });
            return;
        }
        setCurrencies(prev => prev.filter(c => c !== currencyToRemove));
        toast({ title: "نجاح", description: `تمت إزالة العملة ${currencyToRemove}.`, variant: "destructive" });
      };
      
      useEffect(() => {
        if (!currencies.includes(defaultCurrency)) {
            setCurrencies(prev => [defaultCurrency, ...prev.filter(c => c !== defaultCurrency)]);
        }
      }, [defaultCurrency, currencies, setCurrencies]);


      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <DollarSign className="mr-2 rtl:ml-2 h-6 w-6" />
              إدارة العملات
            </CardTitle>
            <CardDescription>
              أضف أو أزل العملات المستخدمة في التطبيق. العملة الافتراضية هي {defaultCurrency}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
                placeholder="أدخل رمز العملة (مثل EUR)"
                maxLength={5}
              />
              <Button onClick={handleAddCurrency} variant="outline">
                <PlusCircle className="h-4 w-4 mr-2 rtl:ml-2"/> إضافة
              </Button>
            </div>
            <div className="space-y-2">
              <Label>العملات الحالية:</Label>
              <div className="flex flex-wrap gap-2">
                {currencies.map(c => (
                  <div key={c} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${c === defaultCurrency ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-secondary text-secondary-foreground'}`}>
                    {c}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      onClick={() => handleRemoveCurrency(c)}
                      disabled={(currencies.length <= 1 && currencies[0] === c) || c === defaultCurrency}
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };
    export default CurrencySettings;