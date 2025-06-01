import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { DatePicker } from '@/components/ui/date-picker';
    import { useToast } from '@/components/ui/use-toast';

    const DebtFormModal = ({ isOpen, onClose, onSave, debt, people, availableCurrencies, defaultCurrency, initialFormData }) => {
      const [formData, setFormData] = useState(initialFormData);
      const { toast } = useToast();

      useEffect(() => {
        if (debt) {
          setFormData({
            ...debt,
            dueDate: debt.dueDate ? new Date(debt.dueDate) : null,
          });
        } else {
          setFormData({...initialFormData, currency: defaultCurrency});
        }
      }, [debt, isOpen, defaultCurrency, initialFormData]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, dueDate: date }));
      };

      const handleSubmit = () => {
        if (!formData.personId || !formData.amount || !formData.currency) {
          toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة: الشخص، المبلغ، والعملة.", variant: "destructive" });
          return;
        }

        const debtDataToSave = {
          id: debt ? debt.id : Date.now().toString(),
          ...formData,
          amount: parseFloat(formData.amount),
          createdAt: debt ? debt.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        onSave(debtDataToSave);
      };
      
      const handleClose = () => {
        setFormData(initialFormData); 
        onClose();
      }

      return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
          <DialogContent className="sm:max-w-[480px] bg-card border-border shadow-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">
                {debt ? 'تعديل الدين' : 'إضافة دين جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="personId" className="text-right">الشخص</Label>
                <Select name="personId" value={formData.personId} onValueChange={(value) => handleSelectChange('personId', value)}>
                  <SelectTrigger id="personId" className="w-full">
                    <SelectValue placeholder="اختر شخصًا" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-right">المبلغ</Label>
                  <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleInputChange} placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency" className="text-right">العملة</Label>
                  <Select name="currency" value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-right">نوع الدين</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="اختر نوع الدين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owed_to_me">مستحق لي (أنا الدائن)</SelectItem>
                    <SelectItem value="i_owe">مستحق علي (أنا المدين)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate" className="text-right">تاريخ الاستحقاق (اختياري)</Label>
                <DatePicker date={formData.dueDate} setDate={handleDateChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-right">الوصف (اختياري)</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="مثال: قرض شخصي" />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {debt ? 'حفظ التعديلات' : 'إضافة الدين'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto mt-2 sm:mt-0">
                  إلغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default DebtFormModal;