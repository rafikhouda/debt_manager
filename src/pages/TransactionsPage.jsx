import React, { useState, useMemo } from 'react';
    import { motion } from 'framer-motion';
    import { ListFilter, Search, ArrowUpDown, FileText, Edit, PlusSquare, Trash, CheckSquare, XSquare } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { format } from 'date-fns';
    import { arSA } from 'date-fns/locale';
    import { Badge } from '@/components/ui/badge';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

    const transactionTypeLabels = {
      new_debt: 'دين جديد',
      debt_updated: 'تحديث دين',
      debt_deleted: 'حذف دين',
      debt_paid: 'دين مدفوع',
      debt_unpaid: 'دين غير مدفوع',
    };

    const transactionTypeIcons = {
      new_debt: <PlusSquare className="h-4 w-4 text-blue-500" />,
      debt_updated: <Edit className="h-4 w-4 text-yellow-500" />,
      debt_deleted: <Trash className="h-4 w-4 text-red-500" />,
      debt_paid: <CheckSquare className="h-4 w-4 text-green-500" />,
      debt_unpaid: <XSquare className="h-4 w-4 text-orange-500" />,
    };
    
    const transactionTypeColors = {
      new_debt: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
      debt_updated: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
      debt_deleted: 'bg-red-500/10 text-red-700 border-red-500/30',
      debt_paid: 'bg-green-500/10 text-green-700 border-green-500/30',
      debt_unpaid: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
    };


    const TransactionsPage = () => {
      const [transactions] = useLocalStorage('transactions', []);
      const [debts] = useLocalStorage('debts', []);
      const [people] = useLocalStorage('people', []);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterType, setFilterType] = useState('all');
      const [sortOrder, setSortOrder] = useState('desc');

      const enrichedTransactions = useMemo(() => {
        return transactions.map(t => {
          const debt = debts.find(d => d.id === t.debtId);
          const person = debt ? people.find(p => p.id === debt.personId) : null;
          return {
            ...t,
            debtDescription: debt ? debt.description : 'دين محذوف',
            personName: person ? person.name : 'شخص غير معروف',
          };
        });
      }, [transactions, debts, people]);

      const filteredAndSortedTransactions = useMemo(() => {
        return enrichedTransactions
          .filter(t => {
            const matchesSearch = searchTerm === '' ||
              t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.debtDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.amount?.toString().includes(searchTerm);
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesSearch && matchesType;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });
      }, [enrichedTransactions, searchTerm, filterType, sortOrder]);

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
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">سجل المعاملات</h1>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card/50 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="ابحث في المعاملات..." 
                className="pl-10 rtl:pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="فلترة حسب نوع المعاملة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                {Object.entries(transactionTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              ترتيب حسب التاريخ ({sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'})
            </Button>
          </motion.div>

          {filteredAndSortedTransactions.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-10 px-6 bg-card/50 rounded-xl shadow-lg">
              <FileText className="mx-auto h-16 w-16 text-primary/70 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">لا توجد معاملات تطابق بحثك</h2>
              <p className="text-muted-foreground">
                حاول تعديل معايير البحث أو قم بإضافة معاملات جديدة.
              </p>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle>قائمة المعاملات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">التاريخ</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>الشخص</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedTransactions.map(t => (
                        <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{format(new Date(t.date), 'PPP p', { locale: arSA })}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`whitespace-nowrap ${transactionTypeColors[t.type] || ''}`}>
                              <span className="mr-1 rtl:ml-1">{transactionTypeIcons[t.type]}</span>
                              {transactionTypeLabels[t.type] || t.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate" title={t.description || t.debtDescription}>{t.description || t.debtDescription}</TableCell>
                          <TableCell>{t.personName}</TableCell>
                          <TableCell className="text-right font-mono">
                            {t.amount ? `${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t.currency || ''}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default TransactionsPage;