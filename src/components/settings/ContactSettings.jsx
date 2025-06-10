import React, { useState, useEffect } from 'react';
    import { Users, CheckCircle, XCircle, UploadCloud } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { useLocalStorage } from '@/hooks/useLocalStorage';

    const ContactSettings = () => {
      const [contactsPermission, setContactsPermission] = useState('prompt');
      const [people, setPeople] = useLocalStorage('people', []);
      const { toast } = useToast();
      const [isPickerSupported, setIsPickerSupported] = useState(false);
      const [isPickingContacts, setIsPickingContacts] = useState(false);

      useEffect(() => {
        if ('contacts' in navigator && 'ContactsManager' in window) {
          setIsPickerSupported(true);
          navigator.permissions.query({ name: 'contacts' }).then(status => {
            setContactsPermission(status.state);
            status.onchange = () => setContactsPermission(status.state);
          });
        } else {
          setIsPickerSupported(false);
        }
      }, []);

      const handleRequestContacts = async () => {
        if (!isPickerSupported) {
          toast({
            title: "غير مدعوم",
            description: "متصفحك لا يدعم الوصول إلى جهات الاتصال.",
            variant: "destructive",
          });
          return;
        }

        if (isPickingContacts) {
          toast({
            title: "لحظة من فضلك",
            description: "عملية اختيار جهات الاتصال جارية بالفعل.",
            variant: "default",
          });
          return;
        }

        setIsPickingContacts(true);
        try {
          const props = ['name', 'tel'];
          const opts = { multiple: true };
          const contacts = await navigator.contacts.select(props, opts);
          
          if (contacts.length > 0) {
            const newPeople = contacts.map(contact => ({
              id: window.crypto.randomUUID(),
              name: contact.name ? contact.name.join(', ') : 'اسم غير معروف',
              phone: contact.tel ? contact.tel[0] : '',
              email: '', 
              notes: 'مستورد من جهات الاتصال',
            }));

            const uniqueNewPeople = newPeople.filter(np => 
              !people.some(p => p.name === np.name && p.phone === np.phone)
            );

            if (uniqueNewPeople.length > 0) {
              setPeople(prevPeople => [...prevPeople, ...uniqueNewPeople]);
              toast({
                title: "نجاح",
                description: `تم استيراد ${uniqueNewPeople.length} جهة اتصال جديدة بنجاح!`,
              });
            } else {
              toast({
                title: "لا توجد جهات اتصال جديدة",
                description: "لم يتم العثور على جهات اتصال جديدة غير موجودة مسبقًا.",
                variant: "default",
              });
            }
          } else {
            toast({
              title: "لم يتم اختيار جهات اتصال",
              description: "لم تقم باختيار أي جهات اتصال.",
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Error selecting contacts:", error);
          if (error.name === 'InvalidStateError' && error.message.includes('already in use')) {
             toast({
              title: "خطأ في الأذونات",
              description: "تم رفض الإذن أو حدث خطأ: منتقي جهات الاتصال قيد الاستخدام بالفعل. يرجى المحاولة مرة أخرى بعد إغلاق أي نوافذ منبثقة لاختيار جهات الاتصال.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "خطأ في الأذونات",
              description: "تم رفض الإذن أو حدث خطأ أثناء محاولة الوصول لجهات الاتصال.",
              variant: "destructive",
            });
          }
        } finally {
          setIsPickingContacts(false);
        }
      };

      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Users className="mr-2 rtl:ml-2 h-6 w-6" />
              أذونات جهات الاتصال
            </CardTitle>
            <CardDescription>
              اسمح للتطبيق بالوصول إلى جهات اتصال هاتفك لتسهيل إضافة الأشخاص.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isPickerSupported && (
              <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                <p className="font-bold">ميزة غير مدعومة</p>
                <p>متصفحك الحالي لا يدعم واجهة برمجة تطبيقات Contact Picker. قد لا تعمل هذه الميزة.</p>
              </div>
            )}
            {isPickerSupported && (
              <>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {contactsPermission === 'granted' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-sm ${contactsPermission === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
                    {contactsPermission === 'granted' ? 'الإذن لجهات الاتصال ممنوح' : 'الإذن لجهات الاتصال غير ممنوح'}
                  </span>
                </div>
                <Button 
                  onClick={handleRequestContacts} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground"
                  disabled={isPickingContacts}
                >
                  <UploadCloud className="mr-2 rtl:ml-2 h-4 w-4" />
                  {isPickingContacts ? 'جاري الاستيراد...' : 'طلب إذن الوصول واستيراد جهات الاتصال'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  ملاحظة: هذه الميزة تعتمد على دعم متصفحك لـ Contact Picker API. قد لا تعمل في جميع المتصفحات أو الأجهزة. البيانات المستوردة تُخزن محليًا فقط على جهازك.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      );
    };

    export default ContactSettings;
