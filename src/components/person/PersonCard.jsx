import React from 'react';
    import { motion } from 'framer-motion';
    import { Edit, Trash2, User } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
    import { Badge } from '@/components/ui/badge';

    const PersonCard = ({ person, debtSummary, personTypeLabel, onEdit, onDelete, debts }) => {
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };
      const totalOwedToMe = Object.values(debtSummary.owedToMe).reduce((s,a) => s+a, 0);
      const totalIOwe = Object.values(debtSummary.iOwe).reduce((s,a) => s+a, 0);

      return (
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <User className="w-6 h-6 mr-2 rtl:ml-2 text-primary/80"/>
                  {person.name}
                </CardTitle>
                <Badge variant="secondary" className="capitalize text-xs">{personTypeLabel}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-green-600">مستحق لي منهم:</p>
                {Object.entries(debtSummary.owedToMe).map(([currency, amount]) => 
                  amount > 0 && <p key={currency} className="text-sm text-green-500">{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</p>
                )}
                {totalOwedToMe === 0 && <p className="text-sm text-muted-foreground">لا شيء</p>}
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">مستحق علي لهم:</p>
                 {Object.entries(debtSummary.iOwe).map(([currency, amount]) => 
                  amount > 0 && <p key={currency} className="text-sm text-red-500">{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</p>
                )}
                {totalIOwe === 0 && <p className="text-sm text-muted-foreground">لا شيء</p>}
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-3 border-t border-border/50">
                <Button variant="ghost" size="icon" onClick={onEdit} title="تعديل الشخص">
                  <Edit className="h-5 w-5 text-blue-500" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="حذف الشخص">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد?</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيؤدي هذا الإجراء إلى حذف الشخص بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                        {debts.some(debt => debt.personId === person.id && !debt.isPaid) && <span className="block text-red-500 mt-2">تحذير: هذا الشخص لديه ديون نشطة.</span>}
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

    export default PersonCard;