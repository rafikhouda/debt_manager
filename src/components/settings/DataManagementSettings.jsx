import React from 'react';
    import { Palette, Trash2 } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

    const DataManagementSettings = () => {
      const { toast } = useToast();

      const handleExportData = () => {
        const dataToExport = {};
        const keysToExport = ['debts', 'people', 'transactions', 'settingsCurrencies', 'isPinEnabled', 'appPin', 'contactsPermissionGranted'];
        
        keysToExport.forEach(key => {
          const item = localStorage.getItem(key);
          if (item !== null) {
            try {
              dataToExport[key] = JSON.parse(item);
            } catch (e) {
              dataToExport[key] = item;
            }
          }
        });

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `debt_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        toast({ title: "نجاح", description: "تم تصدير البيانات بنجاح." });
      };

      const handleImportData = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const importedData = JSON.parse(e.target.result);
              Object.keys(importedData).forEach(key => {
                 if (typeof importedData[key] === 'object' || Array.isArray(importedData[key])) {
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                 } else {
                    localStorage.setItem(key, importedData[key]);
                 }
              });
              toast({ title: "نجاح", description: "تم استيراد البيانات بنجاح. يرجى تحديث الصفحة." });
              setTimeout(() => window.location.reload(), 1500); 
            } catch (error) {
              toast({ title: "خطأ", description: "فشل استيراد البيانات. الملف غير صالح أو تالف.", variant: "destructive" });
              console.error("Import error:", error);
            }
          };
          reader.readAsText(file);
          event.target.value = null; 
        }
      };
      
      const handleClearData = () => {
        const keysToKeep = []; // Add any keys you want to preserve, e.g. theme settings
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !keysToKeep.includes(key)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        toast({ title: "تم الحذف", description: "تم مسح جميع بيانات التطبيق القابلة للإزالة.", variant: "destructive" });
        setTimeout(() => window.location.reload(), 1500);
      };


      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Palette className="mr-2 rtl:ml-2 h-6 w-6" />
              إدارة البيانات
            </CardTitle>
             <CardDescription>
              إدارة بيانات التطبيق والمظهر العام.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExportData} variant="outline" className="w-full">تصدير البيانات</Button>
                <div className="w-full">
                    <Input id="import-file" type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    <Label htmlFor="import-file" className="w-full">
                        <Button asChild variant="outline" className="w-full cursor-pointer">
                            <span>استيراد البيانات</span>
                        </Button>
                    </Label>
                </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 rtl:ml-2 h-4 w-4" /> مسح جميع البيانات
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيؤدي هذا الإجراء إلى حذف جميع بيانات التطبيق بشكل دائم (الديون، الأشخاص، المعاملات، الإعدادات). لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleClearData}
                  >
                    نعم، قم بحذف كل شيء
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      );
    };
    export default DataManagementSettings;