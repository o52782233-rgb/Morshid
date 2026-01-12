import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { FileText, CheckCircle, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import FloatingChatbot from '../components/FloatingChatbot';
import { Input } from '../components/ui/input';

interface Procedure {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  steps?: string[] | null;
  category?: string;
}

export default function Procedures() {
  const [proceduresList, setProceduresList] = useState<Procedure[]>([]);
  const [filteredProcedures, setFilteredProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const { data, error } = await supabase.from('procedures').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error('❌ Error fetching procedures:', error);
          throw error;
        }
        console.log('✅ Procedures fetched:', data);
        console.log('📊 Procedures count:', data?.length || 0);
        setProceduresList(data || []);
        setFilteredProcedures(data || []);
      } catch (error) {
        console.error('Error fetching procedures:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcedures();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProcedures(proceduresList);
    } else {
      const filtered = proceduresList.filter(proc =>
        proc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(proc.steps) && proc.steps.some(step => step?.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredProcedures(filtered);
    }
  }, [searchQuery, proceduresList]);

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900 relative">
      <FloatingChatbot />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            الإجراءات والمعاملات
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
                دليل شامل لجميع الإجراءات الإدارية والأكاديمية - عمادة شؤون الطلبة
          </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن إجراء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 py-6 text-lg"
            />
          </div>
        </motion.div>

        {/* Procedures Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProcedures.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {searchQuery ? 'لم يتم العثور على إجراءات مطابقة' : 'لا توجد إجراءات متاحة'}
              </p>
            </div>
          ) : (
          <Accordion type="single" collapsible className="space-y-4">
              {filteredProcedures.map((procedure, index) => (
              <motion.div
                key={procedure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem value={procedure.id} className="border-none">
                  <Card>
                    <AccordionTrigger className="hover:no-underline p-0">
                      <CardHeader className="w-full">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="flex-1 text-right">
                            <CardTitle className="text-xl mb-2">{procedure.title || procedure.name || 'إجراء بدون عنوان'}</CardTitle>
                            <CardDescription className="text-base">
                              {procedure.description || 'لا يوجد وصف متاح'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            الخطوات:
                          </h4>
                          {Array.isArray(procedure.steps) && procedure.steps.length > 0 ? (
                            procedure.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 flex-1">
                                  {step || 'خطوة غير محددة'}
                              </p>
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              لا توجد خطوات متاحة لهذا الإجراء
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                هل تحتاج إلى مساعدة؟
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                يمكنك استخدام المرشد التقني الذكي للحصول على إجابات فورية لاستفساراتك
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
