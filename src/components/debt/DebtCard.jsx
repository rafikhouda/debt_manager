import React from 'react';
    import { motion } from 'framer-motion';
    import { Edit, Trash2, CheckCircle, XCircle, CalendarDays, DollarSign } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
    import { format } from 'date-fns';
    import { arSA } from 'date-fns/locale';
    import { Badge } from '@/components/ui/badge';

    const DebtCard = ({ debt, person, onEdit, onDelete, onTogglePaid }) => {
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

      return (
        <motion.div variants={itemVariants}>
          <Card className={`relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${debt.isPaid ? 'bg-green-500/10 border-green-500/30' : 'bg-card'}`}>
            {debt.isPaid && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">مدفوع</div>}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold text-primary flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 rtl:ml-2 text-primary/80"/>
                    {debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {debt.currency}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {debt.type === 'owed_to_me' ? 'مستحق لي من' : 'مستحق علي لـ'} {person ? person.name : 'شخص غير معروف'}
                  </CardDescription>
                </div>
                 <Badge variant={debt.type === 'owed_to_me' ? 'default' : 'destructive'} className="capitalize text-xs">
                  {debt.type === 'owed_to_me' ? 'دائن' : 'مدين'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {debt.description && <p className="text-sm text-foreground/90"><span className="font-medium">الوصف:</span> {debt.description}</p>}
              {debt.dueDate && (
                <p className={`text-sm flex items-center ${new Date(debt.dueDate) < new Date() && !debt.isPaid ? 'text-red-500 font-semibold' : 'text-foreground/90'}`}>
                  <CalendarDays className="w-4 h-4 mr-2 rtl:ml-2"/>
                  <span className="font-medium">تاريخ الاستحقاق:</span> {format(new Date(debt.dueDate), 'PPP', { locale: arSA })}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                أُضيف في: {format(new Date(debt.createdAt), 'PPP p', { locale: arSA })}
              </p>
              <div className="flex justify-end items-center space-x-2 rtl:space-x-reverse pt-3 border-t border-border/50">
                <Button variant="ghost" size="icon" onClick={onTogglePaid} title={debt.isPaid ? "وضع علامة كغير مدفوع" : "وضع علامة كمدفوع"}>
                  {debt.isPaid ? <XCircle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onEdit} title="تعديل الدين">
                  <Edit className="h-5 w-5 text-blue-500" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="حذف الدين">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد?</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيؤدي هذا الإجراء إلى حذف الدين بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default DebtCard;