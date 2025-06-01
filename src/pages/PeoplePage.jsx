import React, { useState, useMemo } from 'react';
    import { motion } from 'framer-motion';
    import { PlusCircle, Filter, Search, Users as UsersIcon } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';
    import PersonFormModal from '@/components/person/PersonFormModal';
    import PersonCard from '@/components/person/PersonCard';

    const PeoplePage = () => {
      const [people, setPeople] = useLocalStorage('people', []);
      const [debts] = useLocalStorage('debts', []);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentPerson, setCurrentPerson] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterType, setFilterType] = useState('all');
      const { toast } = useToast();

      const initialFormData = { name: '', type: 'individual' };

      const handleSavePerson = (personData) => {
        if (currentPerson) {
          setPeople(prev => prev.map(p => p.id === personData.id ? personData : p));
          toast({ title: "نجاح", description: "تم تحديث بيانات الشخص بنجاح." });
        } else {
          setPeople(prev => [...prev, personData]);
          toast({ title: "نجاح", description: "تم إضافة الشخص بنجاح." });
        }
        setIsModalOpen(false);
        setCurrentPerson(null);
      };

      const openEditModal = (person) => {
        setCurrentPerson(person);
        setIsModalOpen(true);
      };

      const handleDeletePerson = (id) => {
        const personHasDebts = debts.some(debt => debt.personId === id && !debt.isPaid);
        if (personHasDebts) {
          toast({
            title: "لا يمكن الحذف",
            description: "هذا الشخص لديه ديون نشطة. يرجى تسوية الديون أولاً.",
            variant: "destructive",
          });
          return;
        }
        setPeople(prev => prev.filter(p => p.id !== id));
        toast({ title: "نجاح", description: "تم حذف الشخص بنجاح.", variant: "destructive" });
      };

      const getPersonDebtSummary = (personId) => {
        const personDebts = debts.filter(d => d.personId === personId && !d.isPaid);
        const summary = { owedToMe: {}, iOwe: {} };
        const currencies = [...new Set(personDebts.map(d => d.currency))];

        currencies.forEach(currency => {
          summary.owedToMe[currency] = personDebts
            .filter(d => d.type === 'owed_to_me' && d.currency === currency)
            .reduce((sum, d) => sum + d.amount, 0);
          summary.iOwe[currency] = personDebts
            .filter(d => d.type === 'i_owe' && d.currency === currency)
            .reduce((sum, d) => sum + d.amount, 0);
        });
        return summary;
      };

      const filteredPeople = useMemo(() => {
        return people.filter(person => {
          const matchesSearch = searchTerm === '' || person.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = filterType === 'all' || person.type === filterType;
          return matchesSearch && matchesType;
        }).sort((a,b) => a.name.localeCompare(b.name, 'ar'));
      }, [people, searchTerm, filterType]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };
      
      const personTypeLabel = (type) => {
        if (type === 'debtor') return 'مدين';
        if (type === 'creditor') return 'دائن';
        return 'فرد';
      };

      return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">إدارة الأشخاص</h1>
            <Button size="lg" onClick={() => {setCurrentPerson(null); setIsModalOpen(true);}} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
              <PlusCircle className="mr-2 rtl:ml-2 h-5 w-5" /> إضافة شخص جديد
            </Button>
            <PersonFormModal
              isOpen={isModalOpen}
              onClose={() => {setIsModalOpen(false); setCurrentPerson(null);}}
              onSave={handleSavePerson}
              person={currentPerson}
              initialFormData={initialFormData}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card/50 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="ابحث عن شخص..." 
                className="pl-10 rtl:pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="فلترة حسب النوع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="individual">فرد</SelectItem>
                <SelectItem value="debtor">مدين</SelectItem>
                <SelectItem value="creditor">دائن</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterType('all');}} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> مسح الفلاتر
            </Button>
          </motion.div>

          {filteredPeople.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-10 px-6 bg-card/50 rounded-xl shadow-lg">
              <UsersIcon className="mx-auto h-16 w-16 text-primary/70 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">لا يوجد أشخاص تطابق بحثك</h2>
              <p className="text-muted-foreground">
                حاول تعديل معايير البحث أو قم بإضافة شخص جديد.
              </p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  debtSummary={getPersonDebtSummary(person.id)}
                  personTypeLabel={personTypeLabel(person.type)}
                  onEdit={() => openEditModal(person)}
                  onDelete={() => handleDeletePerson(person.id)}
                  debts={debts}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default PeoplePage;