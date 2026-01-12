import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowRight, BookOpen, FileText, Video, Download, ExternalLink, Loader2, PlayCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Course, LectureSummary } from '../../types/library';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectureSummaries, setLectureSummaries] = useState<LectureSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lecture summaries for this course
      const { data: summariesData, error: summariesError } = await supabase
        .from('lecture_summaries')
        .select('*')
        .eq('course_id', id)
        .order('lecture_number', { ascending: true });

      if (summariesError) throw summariesError;
      setLectureSummaries(summariesData || []);
    } catch (error: any) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">المادة غير موجودة</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">لم يتم العثور على المادة المطلوبة</p>
          <Link to="/library">
            <Button>
              <ChevronLeft className="w-4 h-4 ml-2" />
              العودة إلى المكتبة
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/library" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى المكتبة</span>
          </Link>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm inline-block mb-3">
                    {course.code}
                  </div>
                  <CardTitle className="text-3xl mb-2">{course.name}</CardTitle>
                  <CardDescription className="text-base">
                    <div className="space-y-1">
                      <p className="font-medium">{course.department} - {course.faculty}</p>
                      {course.credit_hours && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.credit_hours} ساعة معتمدة
                        </p>
                      )}
                      {course.course_level && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          مستوى: {course.course_level}
                        </p>
                      )}
                    </div>
                  </CardDescription>
                </div>
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {course.description}
              </p>
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">المواد المسبقة:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="summaries" dir="rtl">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="summaries">
                <FileText className="w-4 h-4 ml-2" />
                ملخصات المحاضرات
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 ml-2" />
                الفيديوهات ({course.video_links?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="files">
                <Download className="w-4 h-4 ml-2" />
                الملفات ({course.files?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="exams">
                <FileText className="w-4 h-4 ml-2" />
                أسئلة السنوات ({course.questions?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summaries" className="mt-6">
              {lectureSummaries.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد ملخصات محاضرات متاحة حالياً
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {lectureSummaries.map((summary, index) => (
                    <motion.div
                      key={summary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                                محاضرة {summary.lecture_number}
                              </div>
                              {(summary.semester || summary.year) && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {summary.semester} {summary.year}
                                </span>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{summary.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {summary.content}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              {!course.video_links || course.video_links.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد فيديوهات متاحة حالياً
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {course.video_links.map((videoLink, index) => {
                    const videoId = extractYouTubeVideoId(videoLink);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden">
                          {videoId ? (
                            <div className="aspect-video bg-black">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`فيديو ${index + 1}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <CardHeader className="bg-gray-100 dark:bg-gray-800">
                              <div className="aspect-video flex items-center justify-center">
                                <Video className="w-16 h-16 text-gray-400" />
                              </div>
                            </CardHeader>
                          )}
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium">فيديو {index + 1}</span>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full mt-4"
                              onClick={() => window.open(videoLink, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 ml-2" />
                              فتح في YouTube
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              {!course.files || course.files.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Download className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد ملفات متاحة حالياً
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.files.map((file: any, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded ${
                              file.type === 'pdf' ? 'bg-red-100 dark:bg-red-900' :
                              file.type === 'doc' || file.type === 'docx' ? 'bg-blue-100 dark:bg-blue-900' :
                              'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <FileText className={`w-5 h-5 ${
                                file.type === 'pdf' ? 'text-red-600 dark:text-red-300' :
                                file.type === 'doc' || file.type === 'docx' ? 'text-blue-600 dark:text-blue-300' :
                                'text-gray-600 dark:text-gray-300'
                              }`} />
                            </div>
                            <CardTitle className="text-base line-clamp-2">{file.name || `ملف ${index + 1}`}</CardTitle>
                          </div>
                          <CardDescription className="text-xs uppercase">
                            {file.type || 'ملف'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Download className="w-4 h-4 ml-2" />
                            تحميل الملف
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="exams" className="mt-6">
              {!course.questions || course.questions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد أسئلة سنوات سابقة متاحة حالياً
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {course.questions.map((exam: any, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <CardTitle className="text-lg">
                                {exam.year && exam.semester 
                                  ? `امتحان ${exam.semester} ${exam.year}`
                                  : `أسئلة سنوات سابقة ${index + 1}`
                                }
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {typeof exam.questions === 'string' && exam.questions.startsWith('http') ? (
                            <Button
                              variant="outline"
                              onClick={() => window.open(exam.questions, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 ml-2" />
                              فتح الأسئلة
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {typeof exam.questions === 'string' ? exam.questions : JSON.stringify(exam.questions)}
                              </p>
                              {typeof exam.questions === 'string' && exam.questions.startsWith('http') && (
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(exam.questions, '_blank')}
                                >
                                  <Download className="w-4 h-4 ml-2" />
                                  تحميل
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}