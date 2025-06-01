import React from 'react';
    import { Users, CheckCircle, XCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useLocalStorage } from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const ContactSettings = () => {
      const [permissionGranted, setPermissionGranted] = useLocalStorage('contactsPermissionGranted', false);
      const [people, setPeople] = useLocalStorage('people', []);
      const { toast } = useToast();

      const requestContactsPermission = async () => {
        if (!('contacts' in navigator && 'select' in navigator.contacts)) {
          toast({
            title: "غير مدعوم",
            description: "متصفحك لا يدعم الوصول إلى جهات الاتصال.",
            variant: "destructive",
          });
          return;
        }

        try {
          const props = ['name', 'tel'];
          const opts = { multiple: true };
          const contacts = await navigator.contacts.select(props, opts);

          if (contacts.length > 0) {
            setPermissionGranted(true);
            const newPeople = contacts.map(contact => {
              // Assuming the first name and first tel are primary.
              // This might need more sophisticated handling for multiple names/numbers.
              const name = contact.name && contact.name.length > 0 ? contact.name[0] : 'اسم غير معروف';
              const tel = contact.tel && contact.tel.length > 0 ? contact.tel[0] : '';
              return { 
                id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
                name: name, 
                type: 'individual', // Default type
                phone: tel // Store phone number if available
              };
            }).filter(p => p.name !== 'اسم غير معروف'); // Filter out contacts with no name

            // Add only new contacts (prevent duplicates by name, can be improved with phone too)
            const existingNames = new Set(people.map(p => p.name.toLowerCase()));
            const uniqueNewPeople = newPeople.filter(np => !existingNames.has(np.name.toLowerCase()));

            if (uniqueNewPeople.length > 0) {
              setPeople(prevPeople => [...prevPeople, ...uniqueNewPeople]);
              toast({
                title: "نجاح",
                description: `تم استيراد ${uniqueNewPeople.length} جهة اتصال جديدة.`,
              });
            } else if (newPeople.length > 0) {
               toast({
                title: "معلومة",
                description: "لم يتم العثور على جهات اتصال جديدة غير موجودة مسبقًا.",
                variant: "default",
              });
            } else {
               toast({
                title: "لم يتم الاختيار",
                description: "لم يتم اختيار أي جهات اتصال.",
                variant: "default",
              });
            }
          } else {
             toast({
                title: "لم يتم الاختيار",
                description: "لم يتم اختيار أي جهات اتصال.",
                variant: "default",
              });
          }
        } catch (err) {
          setPermissionGranted(false);
          toast({
            title: "خطأ في الأذونات",
            description: "تم رفض الإذن أو حدث خطأ: " + err.message,
            variant: "destructive",
          });
          console.error("Error accessing contacts:", err);
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
            {permissionGranted ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 rtl:ml-2 h-5 w-5" />
                <span>تم منح الإذن لجهات الاتصال. يمكنك الآن استيراد جهات الاتصال.</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <XCircle className="mr-2 rtl:ml-2 h-5 w-5" />
                <span>الإذن لجهات الاتصال غير ممنوح.</span>
              </div>
            )}
            <Button onClick={requestContactsPermission} variant="outline" className="w-full">
              {permissionGranted ? "استيراد المزيد من جهات الاتصال" : "طلب إذن الوصول واستيراد جهات الاتصال"}
            </Button>
             <p className="text-xs text-muted-foreground">
              ملاحظة: هذه الميزة تعتمد على دعم متصفحك لـ Contact Picker API. قد لا تعمل في جميع المتصفحات أو الأجهزة.
              البيانات المستوردة تُخزن محليًا فقط على جهازك.
            </p>
          </CardContent>
        </Card>
      );
    };

    export default ContactSettings;