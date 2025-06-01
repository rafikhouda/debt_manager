import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';

    const PersonFormModal = ({ isOpen, onClose, onSave, person, initialFormData }) => {
      const [formData, setFormData] = useState(initialFormData);
      const { toast } = useToast();

      useEffect(() => {
        if (person) {
          setFormData(person);
        } else {
          setFormData(initialFormData);
        }
      }, [person, isOpen, initialFormData]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = () => {
        if (!formData.name) {
          toast({ title: "خطأ", description: "يرجى إدخال اسم الشخص.", variant: "destructive" });
          return;
        }

        const personDataToSave = {
          id: person ? person.id : Date.now().toString(),
          ...formData,
        };
        onSave(personDataToSave);
      };
      
      const handleClose = () => {
        setFormData(initialFormData);
        onClose();
      }

      return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
          <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">
                {person ? 'تعديل بيانات الشخص' : 'إضافة شخص جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-right">الاسم</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="اسم الشخص" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-right">نوع الشخص</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="اختر نوع الشخص" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">فرد</SelectItem>
                    <SelectItem value="debtor">مدين (شخص يدين لي)</SelectItem>
                    <SelectItem value="creditor">دائن (شخص أدين له)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {person ? 'حفظ التعديلات' : 'إضافة الشخص'}
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

    export default PersonFormModal;