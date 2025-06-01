import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { DollarSign, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const DashboardPage = () => {
      const [debts] = useLocalStorage('debts', []);
      const [people] = useLocalStorage('people', []);

      const totalOwedToMe = debts
        .filter(d => d.type === 'owed_to_me' && !d.isPaid)
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

      const totalIOwe = debts
        .filter(d => d.type === 'i_owe' && !d.isPaid)
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

      const upcomingReminders = debts.filter(d => !d.isPaid && d.dueDate && new Date(d.dueDate) > new Date() && new Date(d.dueDate) < new Date(new Date().setDate(new Date().getDate() + 7)));
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      };

      const currencies = [...new Set(debts.map(d => d.currency))];

      const getSummaryByCurrency = (type) => {
        const summary = {};
        currencies.forEach(currency => {
          summary[currency] = debts
            .filter(d => d.type === type && d.currency === currency && !d.isPaid)
            .reduce((sum, d) => sum + parseFloat(d.amount), 0);
        });
        return summary;
      };

      const owedToMeByCurrency = getSummaryByCurrency('owed_to_me');
      const iOweByCurrency = getSummaryByCurrency('i_owe');


      return (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2">
            لوحة التحكم
          </motion.h1>

          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/30 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">إجمالي مستحقاتي</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                {Object.entries(owedToMeByCurrency).map(([currency, amount]) => (
                  amount > 0 && <div key={currency} className="text-2xl font-bold">{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</div>
                ))}
                {totalOwedToMe === 0 && <div className="text-2xl font-bold">0.00</div>}
                <p className="text-xs text-muted-foreground">الأموال التي يدين بها الآخرون لك</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-destructive/30 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">إجمالي ديوني</CardTitle>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                {Object.entries(iOweByCurrency).map(([currency, amount]) => (
                  amount > 0 && <div key={currency} className="text-2xl font-bold">{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</div>
                ))}
                {totalIOwe === 0 && <div className="text-2xl font-bold">0.00</div>}
                <p className="text-xs text-muted-foreground">الأموال التي تدين بها للآخرين</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-accent/30 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-accent">إجمالي الأشخاص</CardTitle>
                <Users className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{people.length}</div>
                <p className="text-xs text-muted-foreground">عدد المدينين والدائنين المسجلين</p>
              </CardContent>
            </Card>
          </motion.div>

          {upcomingReminders.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-yellow-500/50 bg-yellow-500/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-600">
                    <AlertTriangle className="h-5 w-5 mr-2 rtl:ml-2" />
                    تذكيرات قادمة ({upcomingReminders.length})
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    الديون المستحقة خلال السبعة أيام القادمة.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {upcomingReminders.slice(0,3).map(debt => (
                      <li key={debt.id} className="text-sm flex justify-between items-center p-2 bg-card/50 rounded-md">
                        <span>{debt.description || 'دين بدون وصف'} (لـ/من {people.find(p => p.id === debt.personId)?.name || 'غير معروف'})</span>
                        <span className="font-semibold">{new Date(debt.dueDate).toLocaleDateString('ar-EG')}</span>
                      </li>
                    ))}
                  </ul>
                  {upcomingReminders.length > 3 && <Link to="/debts?filter=upcoming" className="text-sm text-primary hover:underline mt-2 block">عرض الكل</Link>}
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {debts.length === 0 && people.length === 0 && (
            <motion.div 
              variants={itemVariants} 
              className="text-center py-10 px-6 bg-card/50 rounded-xl shadow-lg"
            >
              <DollarSign className="mx-auto h-16 w-16 text-primary/70 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">مرحباً بك في مدير الديون!</h2>
              <p className="text-muted-foreground mb-6">
                يبدو أنك لم تقم بإضافة أي ديون أو أشخاص بعد. ابدأ بتنظيم أموالك الآن.
              </p>
              <div className="space-x-4 rtl:space-x-reverse">
                <Button asChild variant="default" size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
                  <Link to="/debts">إضافة دين جديد</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/people">إضافة شخص جديد</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default DashboardPage;