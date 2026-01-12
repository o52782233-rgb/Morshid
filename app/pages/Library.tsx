import { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Video,
  Calculator,
  Calendar,
  Users,
  FileText as FileTextIcon,
  ExternalLink,
  Download,
  PlayCircle,
  ChevronLeft,
  Loader2,
  Target,
  Settings,
  MessageCircle,
  Terminal,
  GitBranch,
  BrainCircuit,
  Rocket,
  Database,
  Bot,
  Layout,
  Award,
  UserCheck,
  Star,
  CheckCircle2,
  Laptop,
  Code2
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import FloatingChatbot from '../components/FloatingChatbot';
import { Course, LectureSummary, StudyPlan, LibrarySection } from '../../types/library';
import { cn } from '../components/ui/utils';

// Memoized Stars Component for better performance
const StarsBackground = memo(() => {
  const stars = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
        />
      ))}
    </>
  );
});

StarsBackground.displayName = 'StarsBackground';

export default function Library() {
  const [activeSection, setActiveSection] = useState<LibrarySection>('academic-content');
  const [pathViewMode, setPathViewMode] = useState<'skills' | 'university'>('skills');
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectureSummaries, setLectureSummaries] = useState<LectureSummary[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    summaries: true,
    plans: true,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchCourses(),
      fetchLectureSummaries(),
      fetchStudyPlans(),
    ]);
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchLectureSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from('lecture_summaries')
        .select(`
          *,
          courses (
            id,
            name,
            code,
            department,
            faculty
          )
        `)
        .order('lecture_number', { ascending: true });

      if (error) throw error;

      // Map the data to include course info
      const summaries = (data || []).map(item => ({
        ...item,
        course: item.courses as Course,
      }));

      setLectureSummaries(summaries);
    } catch (error) {
      console.error('Error fetching lecture summaries:', error);
    } finally {
      setLoading(prev => ({ ...prev, summaries: false }));
    }
  };

  const fetchStudyPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('major_name', { ascending: true });

      if (error) throw error;
      setStudyPlans(data || []);
    } catch (error) {
      console.error('Error fetching study plans:', error);
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  // Filter suggested courses (courses with video_links)
  const suggestedCourses = useMemo(() => {
    return courses.filter(
      course => course.video_links && course.video_links.length > 0
    );
  }, [courses]);

  // Group lecture summaries by course
  const groupedSummaries = useMemo(() => {
    const grouped: Record<string, LectureSummary[]> = {};
    lectureSummaries.forEach(summary => {
      const key = summary.course_id;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(summary);
    });
    return grouped;
  }, [lectureSummaries]);

  const sections = [
    { id: 'academic-content' as LibrarySection, label: 'محتوى أكاديمي', icon: BookOpen },
    { id: 'lecture-summaries' as LibrarySection, label: 'ملخصات محاضرات', icon: FileText },
    { id: 'suggested-courses' as LibrarySection, label: 'كورسات مقترحة', icon: Video },
    { id: 'learning-paths' as LibrarySection, label: 'مسارات تعلم', icon: GraduationCap },
    { id: 'tools' as LibrarySection, label: 'أدوات مساعدة', icon: Settings },
  ];

  const tools = [
    {
      title: 'حاسبة المعدل التراكمي',
      description: 'احسب معدلك التراكمي بسهولة',
      icon: Calculator,
      link: '/gpa-calculator',
      color: 'bg-blue-500',
    },
    {
      title: 'الجدول الدراسي',
      description: 'نظم جدولك الدراسي',
      icon: Calendar,
      link: '/schedule',
      color: 'bg-green-500',
    },
    {
      title: 'المجتمع الطلابي',
      description: 'تواصل مع زملائك',
      icon: Users,
      link: '/community',
      color: 'bg-purple-500',
    },
    {
      title: 'الإجراءات',
      description: 'دليل شامل للإجراءات',
      icon: FileTextIcon,
      link: '/procedures',
      color: 'bg-orange-500',
    },
  ];

  const renderAcademicContent = () => {
    if (loading.courses) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            لا توجد مواد دراسية متاحة حالياً
          </p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link to={`/course/${course.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      {course.code}
                    </div>
                    <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl mb-2">{course.name}</CardTitle>
                  <CardDescription>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{course.department}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.faculty}
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {course.files && course.files.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileTextIcon className="w-4 h-4" />
                        {course.files.length} ملف
                      </span>
                    )}
                    {course.video_links && course.video_links.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {course.video_links.length} فيديو
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderLectureSummaries = () => {
    if (loading.summaries) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (lectureSummaries.length === 0) {
      return (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            لا توجد ملخصات محاضرات متاحة حالياً
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(groupedSummaries).map(([courseId, summaries]) => {
          const firstSummary = summaries[0];
          const course = firstSummary.course;

          return (
            <Card key={courseId} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">
                      {course?.name || 'مادة غير معروفة'}
                    </CardTitle>
                    <CardDescription>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {course?.code}
                      </span>
                      <span className="mr-2 text-sm">{course?.department}</span>
                    </CardDescription>
                  </div>
                  <Link to={`/course/${courseId}`}>
                    <Button variant="ghost" size="sm">
                      عرض المادة
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {summaries.map((summary) => (
                    <Card key={summary.id} className="border-2 hover:border-blue-500 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                            محاضرة {summary.lecture_number}
                          </div>
                          {(summary.semester || summary.year) && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {summary.semester} {summary.year}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-base">{summary.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                          {summary.content}
                        </p>
                        <Button variant="ghost" size="sm" className="w-full">
                          اقرأ المزيد
                          <ChevronLeft className="w-4 h-4 mr-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSuggestedCourses = () => {
    const externalCourses = [
      {
        title: 'CS50P: Introduction to Programming with Python',
        provider: 'edX - Harvard University',
        link: 'https://www.edx.org/learn/python/harvard-university-cs50-s-introduction-to-programming-with-python',
        description: 'مقدمة في البرمجة باستخدام بايثون من جامعة هارفارد. كورس شامل ومميز للمبتدئين.',
        type: 'Course'
      },
      {
        title: 'SQL for Data Science',
        provider: 'Coursera',
        link: 'https://www.coursera.org/learn/sql-for-data-science',
        description: 'تعلم أساسيات SQL والتعامل مع قواعد البيانات لتحليل البيانات.',
        type: 'Course'
      },
      {
        title: 'Machine Learning Specialization',
        provider: 'Coursera',
        link: 'https://www.coursera.org/specializations/machine-learning-introduction/',
        description: 'تخصص كامل في تعلم الآلة من Andrew Ng. يغطي الأساسيات حتى التطبيقات المتقدمة.',
        type: 'Specialization'
      },
      {
        title: 'Algorithms, Part I',
        provider: 'Coursera',
        link: 'https://www.coursera.org/learn/algorithms-part1',
        description: 'شرح أساسيات الخوارزميات وهياكل البيانات. مهم جداً لكل مبرمج.',
        type: 'Course'
      }
    ];

    if (loading.courses) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {/* External Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <ExternalLink className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">كورسات خارجية مقترحة</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">دورات عالمية مميزة نوصي بها لتعزيز مهاراتك</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 border-orange-100 dark:border-orange-900/50 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold">
                        {course.provider}
                      </div>
                      <ExternalLink className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-orange-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => window.open(course.link, '_blank')}
                    >
                      الذهاب للكورس
                      <ExternalLink className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* YouTube Playlists Section */}
        <div className="space-y-6 border-t pt-8 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Video className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">فيديوهات تعليمية مختارة (YouTube)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">سلاسل تعليمية كاملة ومجانية من أفضل المصادر</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {
                title: 'دورة Python كاملة',
                description: 'سلسلة تعليمية ممتازة لتعلم Python خطوة بخطوة من البداية.',
                type: 'Python',
                link: 'https://youtube.com/playlist?list=PLhQjrBD2T381WAHyx1pq-sBfykqMBI7V4&si=5Gz8-1kMcSi6IVZx',
                thumbnail: 'https://img.youtube.com/vi/nLRL_NcnK-4/hqdefault.jpg',
                icon: Code2,
                color: 'bg-blue-600',
                stats: '12 فيديو • 15 ساعة'
              },
              {
                title: ' cs 50',
                description: 'دروس تفصيلية لتعلم Java واستخدامها في المشاريع.',
                type: 'Java',
                link: 'https://youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo&si=iqMZFbtyOb6pC7gR',
                thumbnail: 'https://i.ytimg.com/vi/3LPJfIKxwWc/hqdefault.jpg?sqp=-oaymwEnCPYBEIoBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDMPvtVW5cL7tayAT11FdAnU3XPzA',
                icon: Laptop,
                color: 'bg-red-600',
                stats: '25 فيديو • 30 ساعة'
              },
              {
                title: 'رAlgorithms for Big Data (COMPSCI 229r)',
                description: 'كيفية إنشاء صفحات ويب باستخدام HTML و CSS بشكل احترافي.',
                type: 'Web Dev',
                link: 'https://youtube.com/playlist?list=PL2SOU6wwxB0v1kQTpqpuu5kEJo2i-iUyf&si=ls17y6X8_q0LxMcn',
                thumbnail: 'https://i.ytimg.com/vi/s9xSfIw83tk/hqdefault.jpg?sqp=-oaymwFBCPYBEIoBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AHUBoAC4AOKAgwIABABGHIgWCg_MA8=&rs=AOn4CLBgA_RteWiR52Lw0DTbSe7IDPqMsw',
                icon: Layout,
                color: 'bg-orange-500',
                stats: '18 فيديو • 10 ساعات'
              },
              {
                title: 'رAdvanced Algorithms (COMPSCI 224)',
                description: 'تعلم JavaScript لبناء تفاعلية في صفحات الويب.',
                type: 'JavaScript',
                link: 'https://youtube.com/playlist?list=PL2SOU6wwxB0uP4rJgf5ayhHWgw7akUWSf&si=PKz76mcqvLCU5wMo',
                thumbnail: 'https://i.ytimg.com/vi/0JUN9aDxVmI/hqdefault.jpg?sqp=-oaymwFBCPYBEIoBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AHUBoAC4AOKAgwIABABGFcgVihlMA8=&rs=AOn4CLCWlpuJAUBAM8ij7n_Z-YWKU2LieQ',
                icon: FileTextIcon,
                color: 'bg-yellow-500',
                stats: '20 فيديو • 22 ساعة'
              }
            ].map((playlist, index) => {
              const Icon = playlist.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="group border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900 rounded-lg"
                    onClick={() => window.open(playlist.link, '_blank')}
                  >
                    <div className="flex flex-col h-full">
                      {/* Thumbnail Section */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">
                          {playlist.type}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-red-600 rounded-full p-3 shadow-lg">
                            <PlayCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {playlist.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-4 line-clamp-2">
                          {playlist.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-500">
                            {playlist.stats}
                          </span>
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                            <span className="hidden sm:inline">مشاهدة الآن</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* University Courses with Videos Section */}
        {suggestedCourses.length > 0 && (
          <div className="space-y-6 border-t pt-8 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Video className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">محاضرات مصورة من الجامعة</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">مواد دراسية تحتوي على شروحات فيديو</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-2 border-blue-100 dark:border-blue-900/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                          {course.code}
                        </div>
                        <Video className="w-5 h-5 text-blue-500" />
                      </div>
                      <CardTitle className="text-lg mb-2">{course.name}</CardTitle>
                      <CardDescription>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{course.department}</p>
                          <p className="text-xs">{course.faculty}</p>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <PlayCircle className="w-4 h-4" />
                          <span>{course.video_links?.length || 0} فيديو متاح</span>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/course/${course.id}`} className="flex-1">
                            <Button variant="outline" className="w-full" size="sm">
                              عرض المادة
                            </Button>
                          </Link>
                          {course.video_links && course.video_links.length > 0 && (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                              onClick={() => window.open(course.video_links![0], '_blank')}
                            >
                              <PlayCircle className="w-4 h-4 ml-1" />
                              مشاهدة
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {suggestedCourses.length === 0 && (
          <div className="text-center py-12 border-t dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد محاضرات مصورة متاحة من الجامعة حالياً
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderLearningPaths = () => {
    const skillPaths = [
      {
        id: 'programming',
        title: 'مسار تعلم البرمجة من الصفر',
        icon: Terminal,
        videoLink: 'https://www.youtube.com/embed/nLRL_NcnK-4', // Example or placeholder
        gradient: 'from-blue-600 to-cyan-500',
        targetAudience: 'طلاب السنة الأولى أو المبتدئين',
        outcome: 'كتابة برامج بسيطة، فهم المنطق، ونشر مشروعك على GitHub',
        steps: [
          {
            title: 'أساسيات Python',
            description: 'تعلم المتغيرات، الشروط، الحلقات، والدوال (CS50P)',
            link: 'https://www.edx.org/learn/python/harvard-university-cs50-s-introduction-to-programming-with-python',
            icon: Code2,
            type: 'course'
          },
          {
            title: 'تطبيق عملي',
            description: 'تمارين لتثبيت الأساس البرمجي (Kaggle)',
            link: 'https://www.kaggle.com/learn/intro-to-programming/course',
            icon: Laptop,
            type: 'practice'
          },
          {
            title: 'Git & GitHub',
            description: 'إدارة المشاريع ورفع الكود (GitHub Skills)',
            link: 'https://skills.github.com/',
            icon: GitBranch,
            type: 'tool'
          },
          {
            title: 'الخوارزميات',
            description: 'التفكير المنطقي وهياكل البيانات (Coursera)',
            link: 'https://www.coursera.org/learn/algorithms-part1',
            icon: BrainCircuit,
            type: 'concept'
          },
          {
            title: 'مشروع ختامي',
            description: 'بناء تطبيق "قائمة المهام" وحفظ البيانات ورفعه على GitHub',
            icon: Rocket,
            type: 'project'
          }
        ]
      },
      {
        id: 'database',
        title: 'مسار قواعد البيانات',
        icon: Database,
        gradient: 'from-emerald-600 to-teal-500',
        targetAudience: 'طلاب مادة قواعد البيانات وأصحاب المشاريع',
        outcome: 'بناء قواعد بيانات نظيفة وكتابة استعلامات قوية',
        steps: [
          {
            title: 'أساسيات SQL',
            description: 'SQL for Data Science (Coursera)',
            link: 'https://www.coursera.org/learn/sql-for-data-science',
            icon: BookOpen,
            type: 'course'
          },
          {
            title: 'تصميم قواعد البيانات',
            description: 'الجداول، العلاقات، المفاتيح الأساسية والخارجية',
            icon: Layout,
            type: 'concept'
          },
          {
            title: 'تطبيق PostgreSQL',
            description: 'إنشاء DB وجداول واستعلامات (Tutorial)',
            link: 'https://www.postgresql.org/docs/current/tutorial.html',
            icon: Database,
            type: 'practice'
          },
          {
            title: 'مشروع واقعي',
            description: 'نظام مواد جامعي (Students, Courses, Grades) مع تقارير',
            icon: Rocket,
            type: 'project'
          }
        ]
      },
      {
        id: 'ai',
        title: 'مسار الذكاء الاصطناعي',
        icon: Bot,
        gradient: 'from-purple-600 to-pink-500',
        targetAudience: 'بداية منظمة في AI/ML بدون تعقيد',
        outcome: 'فهم المفاهيم وبناء نموذج بسيط وتقييمه',
        steps: [
          {
            title: 'مراجعة Python',
            description: 'مراجعة الأساسيات إذا لزم الأمر (CS50P)',
            link: 'https://cs50.harvard.edu/python/',
            icon: Code2,
            type: 'course'
          },
          {
            title: 'أساسيات تعلم الآلة',
            description: 'Regression/Classification ومفاهيم التقييم',
            link: 'https://www.coursera.org/specializations/machine-learning-introduction/',
            icon: BrainCircuit,
            type: 'course'
          },
          {
            title: 'Google ML Course',
            description: 'تطبيقات وتمارين تفاعلية (Crash Course)',
            link: 'https://developers.google.com/machine-learning/crash-course',
            icon: Laptop,
            type: 'practice'
          },
          {
            title: 'مشروع مصغر',
            description: 'نموذج تصنيف بسيط مع تقرير نتائج الدقة',
            icon: Rocket,
            type: 'project'
          }
        ]
      }
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              مسارات التعلم والخطط
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              اختر بين المسارات المهارية لتطوير نفسك أو الخطط الدراسية الجامعية
            </p>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setPathViewMode('skills')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                pathViewMode === 'skills'
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Target className="w-4 h-4" />
              مسارات مهارية
            </button>
            <button
              onClick={() => setPathViewMode('university')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                pathViewMode === 'university'
                  ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <FileTextIcon className="w-4 h-4" />
              خطط التخصصات
            </button>
          </div>
        </div>

        {pathViewMode === 'university' ? (
          // University Plans Render Logic
          loading.plans ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : studyPlans.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                لا توجد خطط دراسية متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={`/study-plans`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden border-t-4 border-green-500">
                      {plan.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={plan.image_url}
                            alt={plan.major_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                            {plan.major_code}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{plan.major_name}</CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{plan.department}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {plan.college}
                            </p>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {plan.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {plan.years} سنوات
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {plan.total_credit_hours} ساعة معتمدة
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          // Skill Tracks Render Logic
          <div className="grid gap-8">
            {skillPaths.map((path, index) => {
              const PathIcon = path.icon;
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                    <div className={`h-2 bg-gradient-to-r ${path.gradient}`} />
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${path.gradient} text-white shadow-lg`}>
                            <PathIcon className="w-8 h-8" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold">{path.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1 text-base">
                              <UserCheck className="w-4 h-4" />
                              <span className="font-medium">الفئة المستهدفة:</span> {path.targetAudience}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg border border-green-100 dark:border-green-800">
                          <Award className="w-5 h-5" />
                          <span className="text-sm font-medium">النتيجة: {path.outcome}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 relative">
                      {/* Timeline Line */}
                      <div className="absolute right-8 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

                      <div className="space-y-6 md:pr-12">
                        {path.steps.map((step, stepIndex) => {
                          const StepIcon = step.icon;
                          const isLast = stepIndex === path.steps.length - 1;

                          return (
                            <div key={stepIndex} className="relative group">
                              {/* Timeline Dot */}
                              <div className={`absolute right-[-41px] top-1 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 hidden md:flex items-center justify-center z-10 transition-colors duration-300 ${step.type === 'project'
                                ? 'bg-yellow-400 ring-4 ring-yellow-100 dark:ring-yellow-900/30 w-8 h-8 -right-[45px] -top-0.5'
                                : 'bg-blue-200 dark:bg-blue-700 group-hover:bg-blue-500'
                                }`}>
                                {step.type === 'project' && <Star className="w-4 h-4 text-white" fill="currentColor" />}
                              </div>

                              <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl transition-all duration-300 ${step.type === 'project'
                                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-100 dark:border-yellow-900/30'
                                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md'
                                }`}>
                                <div className={`p-3 rounded-lg h-fit ${step.type === 'project' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600' : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                  }`}>
                                  <StepIcon className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                      {step.title}
                                      {step.type === 'project' && <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">مشروع ختامي</span>}
                                    </h4>
                                    {step.type !== 'project' && (
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 w-fit">
                                        {step.type === 'course' ? 'كورس' : step.type === 'practice' ? 'تطبيق عملي' : step.type === 'tool' ? 'أداة' : 'مفهوم'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    {step.description}
                                  </p>

                                  {step.link && (
                                    <a
                                      href={step.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline gap-1 transition-colors"
                                    >
                                      ابدأ التعلم الآن
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderTools = () => {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={tool.link}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-blue-500">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", tool.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full group-hover:text-blue-600">
                      استخدم الأداة
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative" dir="rtl">
      <FloatingChatbot />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 via-purple-600 to-blue-500 text-white py-20 sm:py-24 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          />
          <StarsBackground />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.3)',
                  '0 0 40px rgba(255, 255, 255, 0.5)',
                  '0 0 20px rgba(255, 255, 255, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              المكتبة الإلكترونية
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed"
            >
              كل ما تحتاجه من مصادر ومحتوى للمساقات في مكان واحد
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Section Navigator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile/Tablet: Tabs Navigator */}
        <div className="lg:hidden mb-6">
          <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as LibrarySection)} dir="rtl">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 h-auto p-2 overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs whitespace-nowrap">{section.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Desktop: Sidebar Navigator */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">الأقسام</h3>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right",
                      activeSection === section.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="lg:col-span-3">
            {activeSection === 'academic-content' && renderAcademicContent()}
            {activeSection === 'lecture-summaries' && renderLectureSummaries()}
            {activeSection === 'suggested-courses' && renderSuggestedCourses()}
            {activeSection === 'learning-paths' && renderLearningPaths()}
            {activeSection === 'tools' && renderTools()}
          </main>
        </div>

        {/* Mobile/Tablet: Content with Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as LibrarySection)} dir="rtl">
            <TabsContent value="academic-content" className="mt-6">
              {renderAcademicContent()}
            </TabsContent>
            <TabsContent value="lecture-summaries" className="mt-6">
              {renderLectureSummaries()}
            </TabsContent>
            <TabsContent value="suggested-courses" className="mt-6">
              {renderSuggestedCourses()}
            </TabsContent>
            <TabsContent value="learning-paths" className="mt-6">
              {renderLearningPaths()}
            </TabsContent>
            <TabsContent value="tools" className="mt-6">
              {renderTools()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}