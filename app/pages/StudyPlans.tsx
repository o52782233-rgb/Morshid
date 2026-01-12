import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { GraduationCap, Search, BookOpen, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import FloatingChatbot from '../components/FloatingChatbot';

interface StudyPlan {
  id: string;
  major_name: string;
  major_code: string;
  college: string;
  department: string;
  total_credit_hours: number;
  years: number;
  plan_data: any;
  description: string;
  image_url?: string;
}

export default function StudyPlans() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('major_name', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching study plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.major_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.major_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900 relative">
      <FloatingChatbot />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
                الخطط الدراسية للتخصصات
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                تصفح الخطط الدراسية لجميع التخصصات
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
              placeholder="ابحث عن تخصص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 py-6 text-lg"
            />
          </div>
        </motion.div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              لم يتم العثور على خطط دراسية
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader>
                    {plan.image_url && (
                      <div className="mb-4">
                        <img
                          src={plan.image_url}
                          alt={plan.major_name}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {plan.major_code}
                      </div>
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{plan.major_name}</CardTitle>
                    <CardDescription>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm">{plan.department}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {plan.college}
                        </p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{plan.total_credit_hours} ساعة معتمدة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{plan.years} سنوات</span>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Plan Details Modal */}
        {selectedPlan && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedPlan.major_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPlan.major_code} - {selectedPlan.department}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPlan(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">إجمالي الساعات</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedPlan.total_credit_hours} ساعة</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">مدة الدراسة</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedPlan.years} سنوات</p>
                    </CardContent>
                  </Card>
                </div>

                {selectedPlan.plan_data && Array.isArray(selectedPlan.plan_data) && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      تفاصيل الخطة الدراسية
                    </h3>
                    {selectedPlan.plan_data.map((yearData: any, yearIndex: number) => (
                      <Card key={yearIndex}>
                        <CardHeader>
                          <CardTitle>السنة {yearData.year || yearIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {yearData.semester && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2">{yearData.semester}</h4>
                              {yearData.courses && Array.isArray(yearData.courses) && (
                                <div className="space-y-2">
                                  {yearData.courses.map((course: any, courseIndex: number) => (
                                    <div 
                                      key={courseIndex}
                                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">{course.code || course.name}</span>
                                        {course.name && course.code && (
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            - {course.name}
                                          </span>
                                        )}
                                      </div>
                                      {course.hours && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {course.hours} ساعة
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
