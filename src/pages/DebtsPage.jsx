import React, { useState, useMemo } from 'react';
    import { motion } from 'framer-motion';
    import { PlusCircle, Filter, Search } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';
    import DebtFormModal from '@/components/debt/DebtFormModal';
    import DebtCard from '@/components/debt/DebtCard';
    import { ListChecks } from 'lucide-react';

    const DEFAULT_CURRENCY = 'DZD';

    const DebtsPage = () => {
      const [debts, setDebts] = useLocalStorage('debts', []);
      const [people] = useLocalStorage('people', []);
      const [transactions, setTransactions] = useLocalStorage('transactions', []);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentDebt, setCurrentDebt] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterType, setFilterType] = useState('all');
      const [filterStatus, setFilterStatus] = useState('all');
      const { toast } = useToast();

      const availableCurrencies = useMemo(() => {
        const settingsCurrencies = JSON.parse(localStorage.getItem('settingsCurrencies') || `["${DEFAULT_CURRENCY}", "USD", "EUR"]`);
        return [...new Set([DEFAULT_CURRENCY, ...settingsCurrencies])];
      }, []);

      const initialFormData = {
        personId: '',
        amount: '',
        currency: DEFAULT_CURRENCY,
        type: 'owed_to_me',
        dueDate: null,
        description: '',
        isPaid: false,
      };

      const handleSaveDebt = (debtData) => {
        if (currentDebt) {
          setDebts(prev => prev.map(d => d.id === debtData.id ? debtData : d));
          setTransactions(prev => [...prev, { id: Date.now().toString(), debtId: debtData.id, amount: debtData.amount, currency: debtData.currency, date: new Date().toISOString(), type: 'debt_updated', description: `تم تحديث الدين: ${debtData.description || 'دين'}` }]);
          toast({ title: "نجاح", description: "تم تحديث الدين بنجاح." });
        } else {
          setDebts(prev => [...prev, debtData]);
          setTransactions(prev => [...prev, { id: Date.now().toString(), debtId: debtData.id, amount: debtData.amount, currency: debtData.currency, date: new Date().toISOString(), type: 'new_debt', description: `تم إنشاء دين جديد: ${debtData.description || 'دين'}` }]);
          toast({ title: "نجاح", description: "تم إضافة الدين بنجاح." });
        }
        setIsModalOpen(false);
        setCurrentDebt(null);
      };

      const openEditModal = (debt) => {
        setCurrentDebt(debt);
        setIsModalOpen(true);
      };

      const handleDeleteDebt = (id) => {
        const debtToDelete = debts.find(d => d.id === id);
        setDebts(prev => prev.filter(d => d.id !== id));
        setTransactions(prev => [...prev, { id: Date.now().toString(), debtId: id, amount: debtToDelete?.amount, currency: debtToDelete?.currency, date: new Date().toISOString(), type: 'debt_deleted', description: `تم حذف الدين: ${debtToDelete?.description || 'دين'}` }]);
        toast({ title: "نجاح", description: "تم حذف الدين بنجاح.", variant: "destructive" });
      };
      
      const handleTogglePaidStatus = (id) => {
        setDebts(prevDebts => 
          prevDebts.map(debt => {
            if (debt.id === id) {
              const updatedDebt = { ...debt, isPaid: !debt.isPaid, updatedAt: new Date().toISOString() };
              const transactionType = updatedDebt.isPaid ? 'debt_paid' : 'debt_unpaid';
              const transactionDescription = updatedDebt.isPaid ? `تم دفع الدين: ${updatedDebt.description || 'دين'}` : `تم إلغاء دفع الدين: ${updatedDebt.description || 'دين'}`;
              setTransactions(prevTrans => [...prevTrans, { id: Date.now().toString(), debtId: id, amount: updatedDebt.amount, currency: updatedDebt.currency, date: new Date().toISOString(), type: transactionType, description: transactionDescription }]);
              toast({ title: "نجاح", description: `تم تحديث حالة الدفع للدين.` });
              return updatedDebt;
            }
            return debt;
          })
        );
      };

      const filteredDebts = useMemo(() => {
        return debts.filter(debt => {
          const person = people.find(p => p.id === debt.personId);
          const matchesSearch = searchTerm === '' || 
                                (debt.description && debt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (person && person.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                debt.amount.toString().includes(searchTerm);
          const matchesType = filterType === 'all' || debt.type === filterType;
          const matchesStatus = filterStatus === 'all' || (filterStatus === 'paid' && debt.isPaid) || (filterStatus === 'unpaid' && !debt.isPaid);
          return matchesSearch && matchesType && matchesStatus;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }, [debts, people, searchTerm, filterType, filterStatus]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

      return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">إدارة الديون</h1>
            <Button size="lg" onClick={() => { setCurrentDebt(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
              <PlusCircle className="mr-2 rtl:ml-2 h-5 w-5" /> إضافة دين جديد
            </Button>
            <DebtFormModal
              isOpen={isModalOpen}
              onClose={() => { setIsModalOpen(false); setCurrentDebt(null); }}
              onSave={handleSaveDebt}
              debt={currentDebt}
              people={people}
              availableCurrencies={availableCurrencies}
              defaultCurrency={DEFAULT_CURRENCY}
              initialFormData={initialFormData}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card/50 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="ابحث عن دين..." 
                className="pl-10 rtl:pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="فلترة حسب النوع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="owed_to_me">مستحقة لي</SelectItem>
                <SelectItem value="i_owe">مستحقة علي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="فلترة حسب الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="unpaid">غير مدفوعة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterStatus('all');}} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> مسح الفلاتر
            </Button>
          </motion.div>

          {filteredDebts.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-10 px-6 bg-card/50 rounded-xl shadow-lg">
              <ListChecks className="mx-auto h-16 w-16 text-primary/70 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">لا توجد ديون تطابق بحثك</h2>
              <p className="text-muted-foreground">
                حاول تعديل معايير البحث أو قم بإضافة دين جديد.
              </p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDebts.map(debt => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  person={people.find(p => p.id === debt.personId)}
                  onEdit={() => openEditModal(debt)}
                  onDelete={() => handleDeleteDebt(debt.id)}
                  onTogglePaid={() => handleTogglePaidStatus(debt.id)}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default DebtsPage;