import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Settings,
  GraduationCap,
  Building2,
  Brain
} from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/courses', label: 'إدارة المواد', icon: BookOpen },
    { path: '/dashboard/lecture-summaries', label: 'ملخصات المحاضرات', icon: FileText },
    { path: '/dashboard/study-plans', label: 'الخطط الدراسية', icon: GraduationCap },
    { path: '/dashboard/faculty', label: 'الهيئة التدريسية', icon: Users },
    { path: '/dashboard/departments', label: 'الأقسام', icon: GraduationCap },
    { path: '/dashboard/colleges', label: 'الكليات', icon: Building2 },
    { path: '/dashboard/procedures', label: 'الإجراءات', icon: FileText },
    { path: '/dashboard/ai-knowledge', label: 'قاعدة معرفة AI', icon: Brain },
    { path: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen border-l border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              لوحة التحكم
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/courses" element={<CoursesManagement />} />
            <Route path="/lecture-summaries" element={<LectureSummariesManagement />} />
            <Route path="/study-plans" element={<StudyPlansManagement />} />
            <Route path="/faculty" element={<FacultyManagement />} />
            <Route path="/departments" element={<DepartmentsManagement />} />
            <Route path="/colleges" element={<CollegesManagement />} />
            <Route path="/procedures" element={<ProceduresManagement />} />
            <Route path="/ai-knowledge" element={<AIKnowledgeManagement />} />
            <Route path="/settings" element={<SettingsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DashboardHome() {
  const [stats, setStats] = useState({
    courses: 0,
    lectureSummaries: 0,
    faculty: 0,
    procedures: 0,
    departments: 0,
    colleges: 0,
    studyPlans: 0,
    aiKnowledge: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesResult, lectureSummariesResult, facultyResult, proceduresResult, departmentsResult, collegesResult, studyPlansResult, aiKnowledgeResult] = await Promise.all([
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('lecture_summaries').select('id', { count: 'exact', head: true }),
          supabase.from('faculty').select('id', { count: 'exact', head: true }),
          supabase.from('procedures').select('id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true }),
          supabase.from('colleges').select('id', { count: 'exact', head: true }),
          supabase.from('study_plans').select('id', { count: 'exact', head: true }),
          supabase.from('ai_knowledge').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          courses: coursesResult.count || 0,
          lectureSummaries: lectureSummariesResult.count || 0,
          faculty: facultyResult.count || 0,
          procedures: proceduresResult.count || 0,
          departments: departmentsResult.count || 0,
          colleges: collegesResult.count || 0,
          studyPlans: studyPlansResult.count || 0,
          aiKnowledge: aiKnowledgeResult.count || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { label: 'إجمالي المواد', value: stats.courses, icon: BookOpen, color: 'bg-blue-500', link: '/dashboard/courses' },
    { label: 'ملخصات المحاضرات', value: stats.lectureSummaries, icon: FileText, color: 'bg-teal-500', link: '/dashboard/lecture-summaries' },
    { label: 'الخطط الدراسية', value: stats.studyPlans, icon: GraduationCap, color: 'bg-indigo-500', link: '/dashboard/study-plans' },
    { label: 'أعضاء هيئة التدريس', value: stats.faculty, icon: Users, color: 'bg-green-500', link: '/dashboard/faculty' },
    { label: 'الإجراءات', value: stats.procedures, icon: FileText, color: 'bg-purple-500', link: '/dashboard/procedures' },
    { label: 'الأقسام', value: stats.departments, icon: GraduationCap, color: 'bg-orange-500', link: '/dashboard/departments' },
    { label: 'الكليات', value: stats.colleges, icon: Building2, color: 'bg-pink-500', link: '/dashboard/colleges' },
    { label: 'قاعدة معرفة AI', value: stats.aiKnowledge, icon: Brain, color: 'bg-cyan-500', link: '/dashboard/ai-knowledge' },
  ];

  return (
    <div>
      <h1 className="text-3xl mb-8 text-gray-900 dark:text-white">
        مرحباً بك في لوحة التحكم
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stat.value
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات السريعة</CardTitle>
            <CardDescription>قم بإدارة محتوى المنصة بسهولة</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/dashboard/courses">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="ml-2" />
                إدارة المواد الدراسية
              </Button>
            </Link>
            <Link to="/dashboard/lecture-summaries">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="ml-2" />
                إدارة ملخصات المحاضرات
              </Button>
            </Link>
            <Link to="/dashboard/faculty">
              <Button variant="outline" className="w-full justify-start">
                <Users className="ml-2" />
                إدارة الهيئة التدريسية
              </Button>
            </Link>
            <Link to="/dashboard/departments">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="ml-2" />
                إدارة الأقسام
              </Button>
            </Link>
            <Link to="/dashboard/colleges">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="ml-2" />
                إدارة الكليات
              </Button>
            </Link>
            <Link to="/dashboard/procedures">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="ml-2" />
                إدارة الإجراءات
              </Button>
            </Link>
            <Link to="/dashboard/study-plans">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="ml-2" />
                إدارة الخطط الدراسية
              </Button>
            </Link>
            <Link to="/dashboard/ai-knowledge">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="ml-2" />
                إدارة قاعدة معرفة AI
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات النظام</CardTitle>
            <CardDescription>حالة قاعدة البيانات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">حالة الاتصال</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">متصل</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث</span>
              <span className="text-sm font-medium">{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تم تفعيل جميع الصلاحيات والوظائف الإدارية بنجاح. يمكنك الآن إدارة جميع محتويات المنصة من هذه اللوحة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Search, Edit, Loader2, Video, X, Link as LinkIcon, Upload } from 'lucide-react';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

function CoursesManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseSummaries, setCourseSummaries] = useState<any[]>([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    department: '',
    faculty: '',
    description: '',
    credit_hours: 0,
    course_level: '',
    prerequisites: [] as string[],
    files: [] as any[],
    video_links: [] as string[],
    questions: [] as any[]
  });
  const [newFile, setNewFile] = useState({ name: '', url: '', type: 'pdf' });
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newQuestion, setNewQuestion] = useState({ year: '', semester: '', questions: '' });
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newSummary, setNewSummary] = useState({
    title: '',
    content: '',
    lecture_number: 1,
    semester: '',
    year: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('فشل تحميل المواد: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.code || !newCourse.department || !newCourse.faculty) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const courseData = {
        name: newCourse.name,
        code: newCourse.code,
        department: newCourse.department,
        faculty: newCourse.faculty,
        description: newCourse.description || null,
        credit_hours: newCourse.credit_hours || null,
        course_level: newCourse.course_level || null,
        prerequisites: newCourse.prerequisites || [],
        files: newCourse.files || [],
        video_links: newCourse.video_links || [],
        questions: newCourse.questions || []
      };
      const { error } = await supabase.from('courses').insert([courseData]);
      if (error) throw error;

      toast.success('تم إضافة المادة بنجاح');
      setIsDialogOpen(false);
      setNewCourse({
        name: '', code: '', department: '', faculty: '', description: '',
        credit_hours: 0, course_level: '', prerequisites: [],
        files: [], video_links: [], questions: []
      });
      setNewFile({ name: '', url: '', type: 'pdf' });
      setNewVideoLink('');
      setNewQuestion({ year: '', semester: '', questions: '' });
      setNewPrerequisite('');
      fetchCourses();
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast.error('فشل إضافة المادة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse || !editingCourse.name || !editingCourse.code || !editingCourse.department || !editingCourse.faculty) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const courseData = {
        name: editingCourse.name,
        code: editingCourse.code,
        department: editingCourse.department,
        faculty: editingCourse.faculty,
        description: editingCourse.description || null,
        credit_hours: editingCourse.credit_hours || null,
        course_level: editingCourse.course_level || null,
        prerequisites: editingCourse.prerequisites || [],
        files: editingCourse.files || [],
        video_links: editingCourse.video_links || [],
        questions: editingCourse.questions || []
      };
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id);

      if (error) throw error;

      toast.success('تم تحديث المادة بنجاح');
      setIsDialogOpen(false);
      setEditingCourse(null);
      setNewFile({ name: '', url: '', type: 'pdf' });
      setNewVideoLink('');
      setNewQuestion({ year: '', semester: '', questions: '' });
      setNewPrerequisite('');
      fetchCourses();
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast.error('فشل تحديث المادة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف المادة بنجاح');
      fetchCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast.error('فشل حذف المادة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const fetchCourseSummaries = async (courseId: string) => {
    try {
      setLoadingSummaries(true);
      const { data, error } = await supabase
        .from('lecture_summaries')
        .select('*')
        .eq('course_id', courseId)
        .order('lecture_number', { ascending: true });
      
      if (error) throw error;
      setCourseSummaries(data || []);
    } catch (error: any) {
      console.error('Error fetching course summaries:', error);
      toast.error('فشل تحميل ملخصات المحاضرات');
    } finally {
      setLoadingSummaries(false);
    }
  };

  const handleAddSummary = async (courseId: string) => {
    if (!newSummary.title || !newSummary.content || !newSummary.lecture_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const summaryData = {
        course_id: courseId,
        title: newSummary.title,
        content: newSummary.content,
        lecture_number: newSummary.lecture_number,
        semester: newSummary.semester || null,
        year: newSummary.year || null,
      };
      const { error } = await supabase.from('lecture_summaries').insert([summaryData]);
      if (error) throw error;
      toast.success('تم إضافة ملخص المحاضرة بنجاح');
      setNewSummary({ title: '', content: '', lecture_number: 1, semester: '', year: '' });
      fetchCourseSummaries(courseId);
    } catch (error: any) {
      console.error('Error adding summary:', error);
      toast.error('فشل إضافة ملخص المحاضرة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const handleDeleteSummary = async (summaryId: string, courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف ملخص المحاضرة؟')) return;
    try {
      const { error } = await supabase.from('lecture_summaries').delete().eq('id', summaryId);
      if (error) throw error;
      toast.success('تم حذف ملخص المحاضرة بنجاح');
      fetchCourseSummaries(courseId);
    } catch (error: any) {
      console.error('Error deleting summary:', error);
      toast.error('فشل حذف ملخص المحاضرة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const openEditDialog = (course: any) => {
    setEditingCourse({
      ...course,
      files: course.files || [],
      video_links: course.video_links || [],
      questions: course.questions || [],
      prerequisites: course.prerequisites || [],
      credit_hours: course.credit_hours || 0,
      course_level: course.course_level || ''
    });
    setIsDialogOpen(true);
    if (course.id) {
      fetchCourseSummaries(course.id);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setCourseSummaries([]);
    setNewCourse({
      name: '', code: '', department: '', faculty: '', description: '',
      credit_hours: 0, course_level: '', prerequisites: [],
      files: [], video_links: [], questions: []
    });
    setNewFile({ name: '', url: '', type: 'pdf' });
    setNewVideoLink('');
    setNewQuestion({ year: '', semester: '', questions: '' });
    setNewPrerequisite('');
    setNewSummary({ title: '', content: '', lecture_number: 1, semester: '', year: '' });
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة المواد الدراسية</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingCourse(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مادة</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingCourse ? 'تعديل المادة' : 'إضافة مادة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'قم بتعديل تفاصيل المادة والملفات والروابط والأسئلة' : 'أدخل تفاصيل المادة الدراسية الجديدة مع الملفات والروابط والأسئلة.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم المادة *</Label>
                <Input
                  id="name"
                  value={editingCourse ? editingCourse.name : newCourse.name}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, name: e.target.value })
                    : setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">رمز المادة *</Label>
                <Input
                  id="code"
                  value={editingCourse ? editingCourse.code : newCourse.code}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, code: e.target.value })
                    : setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">القسم *</Label>
                <Input
                  id="department"
                  value={editingCourse ? editingCourse.department : newCourse.department}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, department: e.target.value })
                    : setNewCourse({ ...newCourse, department: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">الكلية *</Label>
                <Input
                  id="faculty"
                  value={editingCourse ? editingCourse.faculty : newCourse.faculty}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, faculty: e.target.value })
                    : setNewCourse({ ...newCourse, faculty: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={editingCourse ? editingCourse.description : newCourse.description}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, description: e.target.value })
                    : setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="credit_hours">عدد الساعات المعتمدة</Label>
                  <Input
                    id="credit_hours"
                    type="number"
                    value={editingCourse ? (editingCourse.credit_hours || '') : (newCourse.credit_hours || '')}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, credit_hours: parseInt(e.target.value) || 0 })
                      : setNewCourse({ ...newCourse, credit_hours: parseInt(e.target.value) || 0 })
                    }
                    className="text-right"
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course_level">مستوى المادة</Label>
                  <Input
                    id="course_level"
                    value={editingCourse ? (editingCourse.course_level || '') : (newCourse.course_level || '')}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, course_level: e.target.value })
                      : setNewCourse({ ...newCourse, course_level: e.target.value })
                    }
                    className="text-right"
                    placeholder="مثال: أولى، ثانية، ثالثة..."
                  />
                </div>
              </div>

              {/* الملفات (PDF/Word) */}
              <div className="grid gap-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>الملفات (PDF/Word)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = editingCourse || newCourse;
                      const files = current.files || [];
                      if (newFile.name && newFile.url) {
                        const updatedFiles = [...files, newFile];
                        if (editingCourse) {
                          setEditingCourse({ ...editingCourse, files: updatedFiles });
                        } else {
                          setNewCourse({ ...newCourse, files: updatedFiles });
                        }
                        setNewFile({ name: '', url: '', type: 'pdf' });
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة ملف
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="اسم الملف"
                    value={newFile.name}
                    onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                    className="text-right"
                  />
                  <Input
                    placeholder="رابط الملف (URL)"
                    value={newFile.url}
                    onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                    className="text-right"
                  />
                  <select
                    value={newFile.type}
                    onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {(editingCourse?.files || newCourse.files || []).map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.type.toUpperCase()})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const current = editingCourse || newCourse;
                          const files = (current.files || []).filter((_: any, i: number) => i !== index);
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, files });
                          } else {
                            setNewCourse({ ...newCourse, files });
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* روابط الفيديو */}
              <div className="grid gap-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>روابط الفيديو</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newVideoLink.trim()) {
                        const current = editingCourse || newCourse;
                        const links = current.video_links || [];
                        const updatedLinks = [...links, newVideoLink.trim()];
                        if (editingCourse) {
                          setEditingCourse({ ...editingCourse, video_links: updatedLinks });
                        } else {
                          setNewCourse({ ...newCourse, video_links: updatedLinks });
                        }
                        setNewVideoLink('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة رابط
                  </Button>
                </div>
                <Input
                  placeholder="رابط الفيديو (YouTube, Vimeo, etc.)"
                  value={newVideoLink}
                  onChange={(e) => setNewVideoLink(e.target.value)}
                  className="text-right"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newVideoLink.trim()) {
                      const current = editingCourse || newCourse;
                      const links = current.video_links || [];
                      const updatedLinks = [...links, newVideoLink.trim()];
                      if (editingCourse) {
                        setEditingCourse({ ...editingCourse, video_links: updatedLinks });
                      } else {
                        setNewCourse({ ...newCourse, video_links: updatedLinks });
                      }
                      setNewVideoLink('');
                    }
                  }}
                />
                <div className="flex flex-col gap-2 mt-2">
                  {(editingCourse?.video_links || newCourse.video_links || []).map((link: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {link}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const current = editingCourse || newCourse;
                          const links = (current.video_links || []).filter((_: string, i: number) => i !== index);
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, video_links: links });
                          } else {
                            setNewCourse({ ...newCourse, video_links: links });
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* الأسئلة */}
              <div className="grid gap-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>أسئلة سنوات سابقة</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newQuestion.year && newQuestion.questions) {
                        const current = editingCourse || newCourse;
                        const questions = current.questions || [];
                        const updatedQuestions = [...questions, { ...newQuestion }];
                        if (editingCourse) {
                          setEditingCourse({ ...editingCourse, questions: updatedQuestions });
                        } else {
                          setNewCourse({ ...newCourse, questions: updatedQuestions });
                        }
                        setNewQuestion({ year: '', semester: '', questions: '' });
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة أسئلة
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="السنة (مثال: 2024)"
                    value={newQuestion.year}
                    onChange={(e) => setNewQuestion({ ...newQuestion, year: e.target.value })}
                    className="text-right"
                  />
                  <Input
                    placeholder="الفصل (مثال: فصل أول)"
                    value={newQuestion.semester}
                    onChange={(e) => setNewQuestion({ ...newQuestion, semester: e.target.value })}
                    className="text-right"
                  />
                </div>
                <Textarea
                  placeholder="رابط أو نص الأسئلة"
                  value={newQuestion.questions}
                  onChange={(e) => setNewQuestion({ ...newQuestion, questions: e.target.value })}
                  className="text-right"
                  rows={2}
                />
                <div className="flex flex-col gap-2 mt-2">
                  {(editingCourse?.questions || newCourse.questions || []).map((q: any, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium">{q.year} - {q.semester}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const current = editingCourse || newCourse;
                            const questions = (current.questions || []).filter((_: any, i: number) => i !== index);
                            if (editingCourse) {
                              setEditingCourse({ ...editingCourse, questions });
                            } else {
                              setNewCourse({ ...newCourse, questions });
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{q.questions}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* المواد المسبقة */}
              <div className="grid gap-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>المواد المسبقة</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newPrerequisite.trim()) {
                        const current = editingCourse || newCourse;
                        const prerequisites = current.prerequisites || [];
                        const updated = [...prerequisites, newPrerequisite.trim()];
                        if (editingCourse) {
                          setEditingCourse({ ...editingCourse, prerequisites: updated });
                        } else {
                          setNewCourse({ ...newCourse, prerequisites: updated });
                        }
                        setNewPrerequisite('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مادة مسبقة
                  </Button>
                </div>
                <Input
                  placeholder="رمز المادة المسبقة (مثال: CS101)"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  className="text-right"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newPrerequisite.trim()) {
                      const current = editingCourse || newCourse;
                      const prerequisites = current.prerequisites || [];
                      const updated = [...prerequisites, newPrerequisite.trim()];
                      if (editingCourse) {
                        setEditingCourse({ ...editingCourse, prerequisites: updated });
                      } else {
                        setNewCourse({ ...newCourse, prerequisites: updated });
                      }
                      setNewPrerequisite('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingCourse?.prerequisites || newCourse.prerequisites || []).map((prereq: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                      <span>{prereq}</span>
                      <button
                        onClick={() => {
                          const current = editingCourse || newCourse;
                          const prerequisites = (current.prerequisites || []).filter((_: string, i: number) => i !== index);
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, prerequisites });
                          } else {
                            setNewCourse({ ...newCourse, prerequisites });
                          }
                        }}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ملخصات المحاضرات - فقط عند تعديل course موجود */}
              {editingCourse && editingCourse.id && (
                <div className="grid gap-2 border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-semibold">ملخصات المحاضرات</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSummary(editingCourse.id)}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة ملخص محاضرة
                    </Button>
                  </div>
                  
                  {/* Form لإضافة ملخص جديد */}
                  <div className="grid gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="lecture_number" className="text-xs">رقم المحاضرة *</Label>
                        <Input
                          id="lecture_number"
                          type="number"
                          value={newSummary.lecture_number}
                          onChange={(e) => setNewSummary({ ...newSummary, lecture_number: parseInt(e.target.value) || 1 })}
                          className="text-right text-sm"
                          min="1"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="semester" className="text-xs">الفصل الدراسي</Label>
                        <Input
                          id="semester"
                          value={newSummary.semester}
                          onChange={(e) => setNewSummary({ ...newSummary, semester: e.target.value })}
                          className="text-right text-sm"
                          placeholder="فصل أول"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="year" className="text-xs">السنة الدراسية</Label>
                        <Input
                          id="year"
                          value={newSummary.year}
                          onChange={(e) => setNewSummary({ ...newSummary, year: e.target.value })}
                          className="text-right text-sm"
                          placeholder="2024-2025"
                        />
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="summary_title" className="text-xs">عنوان الملخص *</Label>
                      <Input
                        id="summary_title"
                        value={newSummary.title}
                        onChange={(e) => setNewSummary({ ...newSummary, title: e.target.value })}
                        className="text-right text-sm"
                        placeholder="عنوان ملخص المحاضرة"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="summary_content" className="text-xs">محتوى الملخص *</Label>
                      <Textarea
                        id="summary_content"
                        value={newSummary.content}
                        onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
                        className="text-right text-sm"
                        rows={4}
                        placeholder="اكتب محتوى ملخص المحاضرة هنا..."
                      />
                    </div>
                  </div>

                  {/* عرض ملخصات المحاضرات الموجودة */}
                  {loadingSummaries ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                      <p className="text-sm text-gray-500 mt-2">جاري التحميل...</p>
                    </div>
                  ) : courseSummaries.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      لا توجد ملخصات محاضرات لهذه المادة
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {courseSummaries.map((summary) => (
                        <div key={summary.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                                محاضرة {summary.lecture_number}
                              </span>
                              {(summary.semester || summary.year) && (
                                <span className="text-xs text-gray-500">
                                  {summary.semester} {summary.year}
                                </span>
                              )}
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSummary(summary.id, editingCourse.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="font-medium text-sm mb-1">{summary.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {summary.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                type="submit"
                onClick={editingCourse ? handleEditCourse : handleAddCourse}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pr-10"
            placeholder="بحث في المواد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-semibold text-gray-900 dark:text-gray-100">رمز المادة</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-gray-100">اسم المادة</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-gray-100">القسم</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-gray-100">الكلية</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">جاري التحميل...</td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">لا توجد مواد</td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3">{course.code}</td>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{course.name}</td>
                    <td className="py-3">{course.department}</td>
                    <td className="py-3">{course.faculty}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => openEditDialog(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FacultyManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('faculty').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setFaculty(data || []);
    } catch (error: any) {
      console.error('Error fetching faculty:', error);
      toast.error('فشل تحميل الهيئة التدريسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name || !newFaculty.title || !newFaculty.department) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('faculty').insert([newFaculty]);
      if (error) throw error;

      toast.success('تم إضافة عضو الهيئة التدريسية بنجاح');
      setIsDialogOpen(false);
      setNewFaculty({ name: '', title: '', department: '', email: '', bio: '' });
      fetchFaculty();
    } catch (error: any) {
      console.error('Error adding faculty:', error);
      toast.error('فشل إضافة عضو الهيئة التدريسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFaculty = async () => {
    if (!editingFaculty || !editingFaculty.name || !editingFaculty.title || !editingFaculty.department) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('faculty')
        .update({
          name: editingFaculty.name,
          title: editingFaculty.title,
          department: editingFaculty.department,
          email: editingFaculty.email,
          bio: editingFaculty.bio
        })
        .eq('id', editingFaculty.id);

      if (error) throw error;

      toast.success('تم تحديث عضو الهيئة التدريسية بنجاح');
      setIsDialogOpen(false);
      setEditingFaculty(null);
      fetchFaculty();
    } catch (error: any) {
      console.error('Error updating faculty:', error);
      toast.error('فشل تحديث عضو الهيئة التدريسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف عضو الهيئة التدريسية بنجاح');
      fetchFaculty();
    } catch (error: any) {
      console.error('Error deleting faculty:', error);
      toast.error('فشل حذف عضو الهيئة التدريسية: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const openEditDialog = (member: any) => {
    setEditingFaculty({ ...member });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFaculty(null);
    setNewFaculty({ name: '', title: '', department: '', email: '', bio: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة الهيئة التدريسية</h1>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setEditingFaculty(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عضو</span>
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingFaculty ? 'تعديل عضو هيئة تدريس' : 'إضافة عضو هيئة تدريس'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  value={editingFaculty ? editingFaculty.name : newFaculty.name}
                  onChange={(e) => editingFaculty
                    ? setEditingFaculty({ ...editingFaculty, name: e.target.value })
                    : setNewFaculty({ ...newFaculty, name: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">الرتبة العلمية *</Label>
                <Input
                  value={editingFaculty ? editingFaculty.title : newFaculty.title}
                  onChange={(e) => editingFaculty
                    ? setEditingFaculty({ ...editingFaculty, title: e.target.value })
                    : setNewFaculty({ ...newFaculty, title: e.target.value })
                  }
                  className="text-right"
                  placeholder="أستاذ, أستاذ مشارك, مدرس..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">القسم *</Label>
                <Input
                  value={editingFaculty ? editingFaculty.department : newFaculty.department}
                  onChange={(e) => editingFaculty
                    ? setEditingFaculty({ ...editingFaculty, department: e.target.value })
                    : setNewFaculty({ ...newFaculty, department: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={editingFaculty ? editingFaculty.email : newFaculty.email}
                  onChange={(e) => editingFaculty
                    ? setEditingFaculty({ ...editingFaculty, email: e.target.value })
                    : setNewFaculty({ ...newFaculty, email: e.target.value })
                  }
                  className="text-right"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">السيرة الذاتية</Label>
                <Textarea
                  value={editingFaculty ? editingFaculty.bio : newFaculty.bio}
                  onChange={(e) => editingFaculty
                    ? setEditingFaculty({ ...editingFaculty, bio: e.target.value })
                    : setNewFaculty({ ...newFaculty, bio: e.target.value })
                  }
                  className="text-right"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingFaculty ? handleEditFaculty : handleAddFaculty}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الاسم</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الرتبة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">القسم</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">البريد</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : faculty.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">لا يوجد أعضاء هيئة تدريس</td></tr>
            ) : (
              faculty.map((member) => (
                <tr key={member.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">{member.name}</td>
                  <td className="p-4">{member.title}</td>
                  <td className="p-4">{member.department}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => openEditDialog(member)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteFaculty(member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DepartmentsManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [newDept, setNewDept] = useState({ name: '', college: '', description: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('departments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast.error('فشل تحميل الأقسام: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddDept = async () => {
    if (!newDept.name || !newDept.college) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('departments').insert([newDept]);
      if (error) throw error;
      toast.success('تم إضافة القسم بنجاح');
      setIsDialogOpen(false);
      setNewDept({ name: '', college: '', description: '' });
      fetchDepartments();
    } catch (error: any) {
      console.error('Error adding department:', error);
      toast.error('فشل إضافة القسم: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDept = async () => {
    if (!editingDept || !editingDept.name || !editingDept.college) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('departments')
        .update({
          name: editingDept.name,
          college: editingDept.college,
          description: editingDept.description
        })
        .eq('id', editingDept.id);

      if (error) throw error;
      toast.success('تم تحديث القسم بنجاح');
      setIsDialogOpen(false);
      setEditingDept(null);
      fetchDepartments();
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast.error('فشل تحديث القسم: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف القسم بنجاح');
      fetchDepartments();
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast.error('فشل حذف القسم: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const openEditDialog = (dept: any) => {
    setEditingDept({ ...dept });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingDept(null);
    setNewDept({ name: '', college: '', description: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة الأقسام</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingDept(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDept ? 'تعديل القسم' : 'إضافة قسم جديد'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم القسم *</Label>
                <Input
                  value={editingDept ? editingDept.name : newDept.name}
                  onChange={(e) => editingDept
                    ? setEditingDept({ ...editingDept, name: e.target.value })
                    : setNewDept({ ...newDept, name: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">الكلية *</Label>
                <Input
                  value={editingDept ? editingDept.college : newDept.college}
                  onChange={(e) => editingDept
                    ? setEditingDept({ ...editingDept, college: e.target.value })
                    : setNewDept({ ...newDept, college: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  value={editingDept ? editingDept.description : newDept.description}
                  onChange={(e) => editingDept
                    ? setEditingDept({ ...editingDept, description: e.target.value })
                    : setNewDept({ ...newDept, description: e.target.value })
                  }
                  className="text-right"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingDept ? handleEditDept : handleAddDept}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الاسم</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الكلية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الوصف</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">لا توجد أقسام</td></tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">{dept.name}</td>
                  <td className="p-4">{dept.college}</td>
                  <td className="p-4">{dept.description}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => openEditDialog(dept)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteDept(dept.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CollegesManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [newCollege, setNewCollege] = useState({ name: '', dean: '', location: '' });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('colleges').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setColleges(data || []);
    } catch (error: any) {
      console.error('Error fetching colleges:', error);
      toast.error('فشل تحميل الكليات: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = async () => {
    if (!newCollege.name) {
      toast.error('يرجى إدخال اسم الكلية');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('colleges').insert([newCollege]);
      if (error) throw error;
      toast.success('تم إضافة الكلية بنجاح');
      setIsDialogOpen(false);
      setNewCollege({ name: '', dean: '', location: '' });
      fetchColleges();
    } catch (error: any) {
      console.error('Error adding college:', error);
      toast.error('فشل إضافة الكلية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCollege = async () => {
    if (!editingCollege || !editingCollege.name) {
      toast.error('يرجى إدخال اسم الكلية');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('colleges')
        .update({
          name: editingCollege.name,
          dean: editingCollege.dean,
          location: editingCollege.location
        })
        .eq('id', editingCollege.id);

      if (error) throw error;
      toast.success('تم تحديث الكلية بنجاح');
      setIsDialogOpen(false);
      setEditingCollege(null);
      fetchColleges();
    } catch (error: any) {
      console.error('Error updating college:', error);
      toast.error('فشل تحديث الكلية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollege = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الكلية؟')) return;
    try {
      const { error } = await supabase.from('colleges').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف الكلية بنجاح');
      fetchColleges();
    } catch (error: any) {
      console.error('Error deleting college:', error);
      toast.error('فشل حذف الكلية: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const openEditDialog = (college: any) => {
    setEditingCollege({ ...college });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCollege(null);
    setNewCollege({ name: '', dean: '', location: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة الكليات</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingCollege(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة كلية</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCollege ? 'تعديل الكلية' : 'إضافة كلية جديدة'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم الكلية *</Label>
                <Input
                  value={editingCollege ? editingCollege.name : newCollege.name}
                  onChange={(e) => editingCollege
                    ? setEditingCollege({ ...editingCollege, name: e.target.value })
                    : setNewCollege({ ...newCollege, name: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dean">العميد</Label>
                <Input
                  value={editingCollege ? editingCollege.dean : newCollege.dean}
                  onChange={(e) => editingCollege
                    ? setEditingCollege({ ...editingCollege, dean: e.target.value })
                    : setNewCollege({ ...newCollege, dean: e.target.value })
                  }
                  className="text-right"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  value={editingCollege ? editingCollege.location : newCollege.location}
                  onChange={(e) => editingCollege
                    ? setEditingCollege({ ...editingCollege, location: e.target.value })
                    : setNewCollege({ ...newCollege, location: e.target.value })
                  }
                  className="text-right"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingCollege ? handleEditCollege : handleAddCollege}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الاسم</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">العميد</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الموقع</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : colleges.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">لا توجد كليات</td></tr>
            ) : (
              colleges.map((college) => (
                <tr key={college.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">{college.name}</td>
                  <td className="p-4">{college.dean}</td>
                  <td className="p-4">{college.location}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => openEditDialog(college)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteCollege(college.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProceduresManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProc, setEditingProc] = useState<any>(null);
  const [newProc, setNewProc] = useState({ title: '', description: '', steps: '', category: '' });

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('procedures').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('❌ Error fetching procedures:', error);
        throw error;
      }
      console.log('✅ Procedures fetched:', data);
      console.log('📊 Procedures count:', data?.length || 0);
      setProcedures(data || []);
    } catch (error: any) {
      console.error('Error fetching procedures:', error);
      toast.error('فشل تحميل الإجراءات: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddProc = async () => {
    if (!newProc.title || !newProc.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const stepsArray = newProc.steps.split('\n').filter(step => step.trim() !== '');
      const { error } = await supabase.from('procedures').insert([{
        title: newProc.title,
        description: newProc.description,
        steps: stepsArray,
        category: newProc.category
      }]);
      if (error) throw error;
      toast.success('تم إضافة الإجراء بنجاح');
      setIsDialogOpen(false);
      setNewProc({ title: '', description: '', steps: '', category: '' });
      fetchProcedures();
    } catch (error: any) {
      console.error('Error adding procedure:', error);
      toast.error('فشل إضافة الإجراء: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProc = async () => {
    if (!editingProc || !editingProc.title || !editingProc.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const stepsArray = typeof editingProc.steps === 'string'
        ? editingProc.steps.split('\n').filter((step: string) => step.trim() !== '')
        : editingProc.steps;

      const { error } = await supabase
        .from('procedures')
        .update({
          title: editingProc.title,
          description: editingProc.description,
          steps: stepsArray,
          category: editingProc.category
        })
        .eq('id', editingProc.id);

      if (error) throw error;
      toast.success('تم تحديث الإجراء بنجاح');
      setIsDialogOpen(false);
      setEditingProc(null);
      fetchProcedures();
    } catch (error: any) {
      console.error('Error updating procedure:', error);
      toast.error('فشل تحديث الإجراء: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProc = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإجراء؟')) return;
    try {
      const { error } = await supabase.from('procedures').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف الإجراء بنجاح');
      fetchProcedures();
    } catch (error: any) {
      console.error('Error deleting procedure:', error);
      toast.error('فشل حذف الإجراء: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const openEditDialog = (proc: any) => {
    const stepsText = Array.isArray(proc.steps) ? proc.steps.join('\n') : proc.steps || '';
    setEditingProc({ ...proc, steps: stepsText });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProc(null);
    setNewProc({ title: '', description: '', steps: '', category: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة الإجراءات</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingProc(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة إجراء</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingProc ? 'تعديل الإجراء' : 'إضافة إجراء جديد'}</DialogTitle>
              <DialogDescription>
                {editingProc ? 'قم بتعديل تفاصيل الإجراء والخطوات' : 'أدخل تفاصيل الإجراء الجديد مع جميع الخطوات المطلوبة'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">العنوان *</Label>
                  <Input
                    value={editingProc ? editingProc.title : newProc.title}
                    onChange={(e) => editingProc
                      ? setEditingProc({ ...editingProc, title: e.target.value })
                      : setNewProc({ ...newProc, title: e.target.value })
                    }
                    className="text-right"
                    placeholder="مثال: إجراءات الحصول على الهوية الجامعية"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Input
                    value={editingProc ? editingProc.category : newProc.category}
                    onChange={(e) => editingProc
                      ? setEditingProc({ ...editingProc, category: e.target.value })
                      : setNewProc({ ...newProc, category: e.target.value })
                    }
                    className="text-right"
                    placeholder="مثال: عمادة شؤون الطلبة"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  value={editingProc ? editingProc.description : newProc.description}
                  onChange={(e) => editingProc
                    ? setEditingProc({ ...editingProc, description: e.target.value })
                    : setNewProc({ ...newProc, description: e.target.value })
                  }
                  className="text-right"
                  rows={2}
                  placeholder="وصف مختصر للإجراء"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="steps">الخطوات * (كل خطوة في سطر منفصل)</Label>
                <Textarea
                  value={editingProc ? editingProc.steps : newProc.steps}
                  onChange={(e) => editingProc
                    ? setEditingProc({ ...editingProc, steps: e.target.value })
                    : setNewProc({ ...newProc, steps: e.target.value })
                  }
                  className="text-right font-sans"
                  rows={10}
                  placeholder="1. الخطوة الأولى&#10;2. الخطوة الثانية&#10;3. الخطوة الثالثة"
                />
                <p className="text-xs text-gray-500">اكتب كل خطوة في سطر منفصل. سيتم حفظها تلقائياً كقائمة مرتبة.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingProc ? handleEditProc : handleAddProc}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[200px]">العنوان</th>
                <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[150px]">الفئة</th>
                <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[200px]">الوصف</th>
                <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[150px]">عدد الخطوات</th>
                <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[120px]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">جاري التحميل...</td></tr>
              ) : procedures.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center">لا توجد إجراءات</td></tr>
              ) : (
                procedures.map((proc) => {
                  const stepsArray = Array.isArray(proc.steps) ? proc.steps : [];
                  return (
                    <tr key={proc.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-white">{proc.title || proc.name || 'إجراء بدون عنوان'}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                          {proc.category || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {proc.description || '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stepsArray.length} خطوة
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                            onClick={() => openEditDialog(proc)}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" 
                              onClick={() => handleDeleteProc(proc.id)}
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudyPlansManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newPlan, setNewPlan] = useState({
    major_name: '',
    major_code: '',
    college: '',
    department: '',
    total_credit_hours: 0,
    years: 4,
    plan_data: [],
    description: '',
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('study_plans').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching study plans:', error);
      toast.error('فشل تحميل الخطط الدراسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    if (!newPlan.major_name || !newPlan.major_code || !newPlan.college || !newPlan.department) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('study_plans').insert([newPlan]);
      if (error) throw error;
      toast.success('تم إضافة الخطة الدراسية بنجاح');
      setIsDialogOpen(false);
      setNewPlan({
        major_name: '', major_code: '', college: '', department: '',
        total_credit_hours: 0, years: 4, plan_data: [], description: '', image_url: ''
      });
      fetchPlans();
    } catch (error: any) {
      console.error('Error adding study plan:', error);
      toast.error('فشل إضافة الخطة الدراسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan || !editingPlan.major_name || !editingPlan.major_code) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('study_plans')
        .update(editingPlan)
        .eq('id', editingPlan.id);
      if (error) throw error;
      toast.success('تم تحديث الخطة الدراسية بنجاح');
      setIsDialogOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error: any) {
      console.error('Error updating study plan:', error);
      toast.error('فشل تحديث الخطة الدراسية: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخطة الدراسية؟')) return;
    try {
      const { error } = await supabase.from('study_plans').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف الخطة الدراسية بنجاح');
      fetchPlans();
    } catch (error: any) {
      console.error('Error deleting study plan:', error);
      toast.error('فشل حذف الخطة الدراسية: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى رفع ملف صورة فقط');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setUploadingImage(true);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `study-plans/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('study-plans')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Try to create bucket if it doesn't exist
        if (uploadError.message.includes('Bucket not found')) {
          toast.error('يرجى إنشاء bucket باسم "study-plans" في Supabase Storage');
          setUploadingImage(false);
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('study-plans')
        .getPublicUrl(filePath);

      // Update state
      if (editingPlan) {
        setEditingPlan({ ...editingPlan, image_url: publicUrl });
      } else {
        setNewPlan({ ...newPlan, image_url: publicUrl });
      }

      toast.success('تم رفع الصورة بنجاح');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('فشل رفع الصورة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setUploadingImage(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
    setNewPlan({
      major_name: '', major_code: '', college: '', department: '',
      total_credit_hours: 0, years: 4, plan_data: [], description: '', image_url: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة الخطط الدراسية</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingPlan(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خطة دراسية</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'تعديل الخطة الدراسية' : 'إضافة خطة دراسية جديدة'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="major_name">اسم التخصص *</Label>
                  <Input
                    value={editingPlan ? editingPlan.major_name : newPlan.major_name}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, major_name: e.target.value })
                      : setNewPlan({ ...newPlan, major_name: e.target.value })
                    }
                    className="text-right"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="major_code">رمز التخصص *</Label>
                  <Input
                    value={editingPlan ? editingPlan.major_code : newPlan.major_code}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, major_code: e.target.value })
                      : setNewPlan({ ...newPlan, major_code: e.target.value })
                    }
                    className="text-right"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="college">الكلية *</Label>
                  <Input
                    value={editingPlan ? editingPlan.college : newPlan.college}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, college: e.target.value })
                      : setNewPlan({ ...newPlan, college: e.target.value })
                    }
                    className="text-right"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">القسم *</Label>
                  <Input
                    value={editingPlan ? editingPlan.department : newPlan.department}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, department: e.target.value })
                      : setNewPlan({ ...newPlan, department: e.target.value })
                    }
                    className="text-right"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="total_credit_hours">إجمالي الساعات المعتمدة *</Label>
                  <Input
                    type="number"
                    value={editingPlan ? editingPlan.total_credit_hours : newPlan.total_credit_hours}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, total_credit_hours: parseInt(e.target.value) || 0 })
                      : setNewPlan({ ...newPlan, total_credit_hours: parseInt(e.target.value) || 0 })
                    }
                    className="text-right"
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="years">عدد السنوات</Label>
                  <Input
                    type="number"
                    value={editingPlan ? editingPlan.years : newPlan.years}
                    onChange={(e) => editingPlan
                      ? setEditingPlan({ ...editingPlan, years: parseInt(e.target.value) || 4 })
                      : setNewPlan({ ...newPlan, years: parseInt(e.target.value) || 4 })
                    }
                    className="text-right"
                    min="1"
                    max="6"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  value={editingPlan ? editingPlan.description : newPlan.description}
                  onChange={(e) => editingPlan
                    ? setEditingPlan({ ...editingPlan, description: e.target.value })
                    : setNewPlan({ ...newPlan, description: e.target.value })
                  }
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">صورة الخطة الدراسية</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="text-right"
                  />
                  {uploadingImage && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                </div>
                {(editingPlan?.image_url || newPlan.image_url) && (
                  <div className="mt-2">
                    <img
                      src={editingPlan?.image_url || newPlan.image_url}
                      alt="صورة الخطة الدراسية"
                      className="max-w-full h-32 object-contain border border-gray-200 dark:border-gray-700 rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (editingPlan) {
                          setEditingPlan({ ...editingPlan, image_url: '' });
                        } else {
                          setNewPlan({ ...newPlan, image_url: '' });
                        }
                      }}
                    >
                      <X className="w-4 h-4 ml-1" />
                      حذف الصورة
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500">يمكنك رفع صورة للخطة الدراسية (JPG, PNG - حد أقصى 5MB)</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan_data">بيانات الخطة (JSON) - سيتم استخدامها لتدريب AI</Label>
                <Textarea
                  value={JSON.stringify(editingPlan ? (editingPlan.plan_data || []) : (newPlan.plan_data || []), null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (editingPlan) {
                        setEditingPlan({ ...editingPlan, plan_data: parsed });
                      } else {
                        setNewPlan({ ...newPlan, plan_data: parsed });
                      }
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="text-right font-mono text-sm"
                  rows={8}
                  placeholder='[{"year": 1, "semester": "فصل أول", "courses": [{"code": "CS101", "name": "برمجة الحاسوب", "hours": 3}]}]'
                />
                <p className="text-xs text-gray-500">صيغة JSON للخطة الدراسية - هذه البيانات ستستخدم لتدريب AI على الإجابة على أسئلة حول الخطة الدراسية</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingPlan ? handleEditPlan : handleAddPlan}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الصورة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">رمز التخصص</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">اسم التخصص</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">القسم</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الساعات</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">لا توجد خطط دراسية</td></tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">
                    {plan.image_url ? (
                      <img
                        src={plan.image_url}
                        alt={plan.major_name}
                        className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
                        لا توجد صورة
                      </div>
                    )}
                  </td>
                  <td className="p-4">{plan.major_code}</td>
                  <td className="p-4 font-medium">{plan.major_name}</td>
                  <td className="p-4">{plan.department}</td>
                  <td className="p-4">{plan.total_credit_hours}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => { setEditingPlan(plan); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeletePlan(plan.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LectureSummariesManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [summaries, setSummaries] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<any>(null);
  const [newSummary, setNewSummary] = useState({
    course_id: '',
    title: '',
    content: '',
    lecture_number: 1,
    semester: '',
    year: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchSummaries(), fetchCourses()]);
  };

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lecture_summaries')
        .select(`
          *,
          courses (
            id,
            name,
            code,
            department
          )
        `)
        .order('lecture_number', { ascending: true });

      if (error) throw error;
      setSummaries(data || []);
    } catch (error: any) {
      console.error('Error fetching lecture summaries:', error);
      toast.error('فشل تحميل ملخصات المحاضرات: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name, code, department')
        .order('name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('فشل تحميل المواد: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const handleAddSummary = async () => {
    if (!newSummary.course_id || !newSummary.title || !newSummary.content || !newSummary.lecture_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const summaryData = {
        course_id: newSummary.course_id,
        title: newSummary.title,
        content: newSummary.content,
        lecture_number: newSummary.lecture_number,
        semester: newSummary.semester || null,
        year: newSummary.year || null,
      };
      const { error } = await supabase.from('lecture_summaries').insert([summaryData]);
      if (error) throw error;
      toast.success('تم إضافة ملخص المحاضرة بنجاح');
      setIsDialogOpen(false);
      setNewSummary({
        course_id: '',
        title: '',
        content: '',
        lecture_number: 1,
        semester: '',
        year: '',
      });
      fetchSummaries();
    } catch (error: any) {
      console.error('Error adding lecture summary:', error);
      toast.error('فشل إضافة ملخص المحاضرة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSummary = async () => {
    if (!editingSummary || !editingSummary.course_id || !editingSummary.title || !editingSummary.content || !editingSummary.lecture_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const summaryData = {
        course_id: editingSummary.course_id,
        title: editingSummary.title,
        content: editingSummary.content,
        lecture_number: editingSummary.lecture_number,
        semester: editingSummary.semester || null,
        year: editingSummary.year || null,
      };
      const { error } = await supabase
        .from('lecture_summaries')
        .update(summaryData)
        .eq('id', editingSummary.id);
      if (error) throw error;
      toast.success('تم تحديث ملخص المحاضرة بنجاح');
      setIsDialogOpen(false);
      setEditingSummary(null);
      fetchSummaries();
    } catch (error: any) {
      console.error('Error updating lecture summary:', error);
      toast.error('فشل تحديث ملخص المحاضرة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSummary = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف ملخص المحاضرة؟')) return;
    try {
      const { error } = await supabase.from('lecture_summaries').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف ملخص المحاضرة بنجاح');
      fetchSummaries();
    } catch (error: any) {
      console.error('Error deleting lecture summary:', error);
      toast.error('فشل حذف ملخص المحاضرة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSummary(null);
    setNewSummary({
      course_id: '',
      title: '',
      content: '',
      lecture_number: 1,
      semester: '',
      year: '',
    });
  };

  const getCourseName = (summary: any) => {
    if (summary.courses) {
      return `${summary.courses.code} - ${summary.courses.name}`;
    }
    return 'مادة غير معروفة';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة ملخصات المحاضرات</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingSummary(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ملخص محاضرة</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSummary ? 'تعديل ملخص المحاضرة' : 'إضافة ملخص محاضرة جديد'}</DialogTitle>
              <DialogDescription>
                أضف ملخصاً لمحاضرة مرتبطة بمادة دراسية
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="course_id">المادة الدراسية *</Label>
                <select
                  id="course_id"
                  value={editingSummary ? editingSummary.course_id : newSummary.course_id}
                  onChange={(e) => editingSummary
                    ? setEditingSummary({ ...editingSummary, course_id: e.target.value })
                    : setNewSummary({ ...newSummary, course_id: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                  required
                >
                  <option value="">اختر المادة الدراسية</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lecture_number">رقم المحاضرة *</Label>
                  <Input
                    type="number"
                    id="lecture_number"
                    value={editingSummary ? editingSummary.lecture_number : newSummary.lecture_number}
                    onChange={(e) => editingSummary
                      ? setEditingSummary({ ...editingSummary, lecture_number: parseInt(e.target.value) || 1 })
                      : setNewSummary({ ...newSummary, lecture_number: parseInt(e.target.value) || 1 })
                    }
                    className="text-right"
                    min="1"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">الفصل الدراسي</Label>
                  <Input
                    id="semester"
                    value={editingSummary ? editingSummary.semester || '' : newSummary.semester}
                    onChange={(e) => editingSummary
                      ? setEditingSummary({ ...editingSummary, semester: e.target.value })
                      : setNewSummary({ ...newSummary, semester: e.target.value })
                    }
                    className="text-right"
                    placeholder="فصل أول، فصل ثاني، صيفي"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">السنة الدراسية</Label>
                  <Input
                    id="year"
                    value={editingSummary ? editingSummary.year || '' : newSummary.year}
                    onChange={(e) => editingSummary
                      ? setEditingSummary({ ...editingSummary, year: e.target.value })
                      : setNewSummary({ ...newSummary, year: e.target.value })
                    }
                    className="text-right"
                    placeholder="2023-2024"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان الملخص *</Label>
                <Input
                  id="title"
                  value={editingSummary ? editingSummary.title : newSummary.title}
                  onChange={(e) => editingSummary
                    ? setEditingSummary({ ...editingSummary, title: e.target.value })
                    : setNewSummary({ ...newSummary, title: e.target.value })
                  }
                  className="text-right"
                  placeholder="عنوان ملخص المحاضرة"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">محتوى الملخص *</Label>
                <Textarea
                  id="content"
                  value={editingSummary ? editingSummary.content : newSummary.content}
                  onChange={(e) => editingSummary
                    ? setEditingSummary({ ...editingSummary, content: e.target.value })
                    : setNewSummary({ ...newSummary, content: e.target.value })
                  }
                  className="text-right"
                  rows={8}
                  placeholder="اكتب محتوى ملخص المحاضرة هنا..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingSummary ? handleEditSummary : handleAddSummary}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">المادة الدراسية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">رقم المحاضرة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">العنوان</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الفصل</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">السنة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : summaries.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">لا توجد ملخصات محاضرات</td></tr>
            ) : (
              summaries.map((summary) => (
                <tr key={summary.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium">{getCourseName(summary)}</td>
                  <td className="p-4">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded text-sm">
                      محاضرة {summary.lecture_number}
                    </span>
                  </td>
                  <td className="p-4">{summary.title}</td>
                  <td className="p-4">{summary.semester || '-'}</td>
                  <td className="p-4">{summary.year || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => { setEditingSummary(summary); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteSummary(summary.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AIKnowledgeManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    title: '',
    content: '',
    keywords: [] as string[],
    priority: 0,
    is_active: true
  });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('ai_knowledge').select('*').order('priority', { ascending: false });
      if (error) throw error;
      setKnowledge(data || []);
    } catch (error: any) {
      console.error('Error fetching AI knowledge:', error);
      toast.error('فشل تحميل قاعدة المعرفة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.category || !newItem.title || !newItem.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('ai_knowledge').insert([newItem]);
      if (error) throw error;
      toast.success('تم إضافة المعلومة بنجاح');
      setIsDialogOpen(false);
      setNewItem({
        category: '', title: '', content: '', keywords: [], priority: 0, is_active: true
      });
      setNewKeyword('');
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error adding AI knowledge:', error);
      toast.error('فشل إضافة المعلومة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !editingItem.category || !editingItem.title || !editingItem.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('ai_knowledge')
        .update(editingItem)
        .eq('id', editingItem.id);
      if (error) throw error;
      toast.success('تم تحديث المعلومة بنجاح');
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error updating AI knowledge:', error);
      toast.error('فشل تحديث المعلومة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المعلومة؟')) return;
    try {
      const { error } = await supabase.from('ai_knowledge').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف المعلومة بنجاح');
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error deleting AI knowledge:', error);
      toast.error('فشل حذف المعلومة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      category: '', title: '', content: '', keywords: [], priority: 0, is_active: true
    });
    setNewKeyword('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة قاعدة معرفة AI</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معلومة</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'تعديل المعلومة' : 'إضافة معلومة جديدة لتدريب AI'}</DialogTitle>
              <DialogDescription>
                أضف معلومات لتدريب المرشد التقني على الإجابة عليها
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Input
                    value={editingItem ? editingItem.category : newItem.category}
                    onChange={(e) => editingItem
                      ? setEditingItem({ ...editingItem, category: e.target.value })
                      : setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="text-right"
                    placeholder="مثال: إجراءات، معلومات عامة، قوانين"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Input
                    type="number"
                    value={editingItem ? editingItem.priority : newItem.priority}
                    onChange={(e) => editingItem
                      ? setEditingItem({ ...editingItem, priority: parseInt(e.target.value) || 0 })
                      : setNewItem({ ...newItem, priority: parseInt(e.target.value) || 0 })
                    }
                    className="text-right"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  value={editingItem ? editingItem.title : newItem.title}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, title: e.target.value })
                    : setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">المحتوى *</Label>
                <Textarea
                  value={editingItem ? editingItem.content : newItem.content}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, content: e.target.value })
                    : setNewItem({ ...newItem, content: e.target.value })
                  }
                  className="text-right"
                  rows={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>الكلمات المفتاحية</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newKeyword.trim()) {
                        const current = editingItem || newItem;
                        const keywords = [...(current.keywords || []), newKeyword.trim()];
                        if (editingItem) {
                          setEditingItem({ ...editingItem, keywords });
                        } else {
                          setNewItem({ ...newItem, keywords });
                        }
                        setNewKeyword('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة
                  </Button>
                </div>
                <Input
                  placeholder="كلمة مفتاحية"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="text-right"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newKeyword.trim()) {
                      const current = editingItem || newItem;
                      const keywords = [...(current.keywords || []), newKeyword.trim()];
                      if (editingItem) {
                        setEditingItem({ ...editingItem, keywords });
                      } else {
                        setNewItem({ ...newItem, keywords });
                      }
                      setNewKeyword('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingItem?.keywords || newItem.keywords || []).map((keyword: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                      <span>{keyword}</span>
                      <button
                        onClick={() => {
                          const current = editingItem || newItem;
                          const keywords = (current.keywords || []).filter((_: string, i: number) => i !== index);
                          if (editingItem) {
                            setEditingItem({ ...editingItem, keywords });
                          } else {
                            setNewItem({ ...newItem, keywords });
                          }
                        }}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingItem ? editingItem.is_active : newItem.is_active}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, is_active: e.target.checked })
                    : setNewItem({ ...newItem, is_active: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">نشط (سيظهر في نتائج البحث)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingItem ? handleEditItem : handleAddItem}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الفئة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">العنوان</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الكلمات المفتاحية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الأولوية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الحالة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : knowledge.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">لا توجد معلومات</td></tr>
            ) : (
              knowledge.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(item.keywords || []).slice(0, 3).map((keyword: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                      {(item.keywords || []).length > 3 && (
                        <span className="text-xs text-gray-500">+{(item.keywords || []).length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{item.priority}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {item.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DuplicateSettingsManagement() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    title: '',
    content: '',
    keywords: [] as string[],
    priority: 0,
    is_active: true
  });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('ai_knowledge').select('*').order('priority', { ascending: false });
      if (error) throw error;
      setKnowledge(data || []);
    } catch (error: any) {
      console.error('Error fetching AI knowledge:', error);
      toast.error('فشل تحميل قاعدة المعرفة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.category || !newItem.title || !newItem.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('ai_knowledge').insert([newItem]);
      if (error) throw error;
      toast.success('تم إضافة المعلومة بنجاح');
      setIsDialogOpen(false);
      setNewItem({
        category: '', title: '', content: '', keywords: [], priority: 0, is_active: true
      });
      setNewKeyword('');
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error adding AI knowledge:', error);
      toast.error('فشل إضافة المعلومة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !editingItem.category || !editingItem.title || !editingItem.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('ai_knowledge')
        .update(editingItem)
        .eq('id', editingItem.id);
      if (error) throw error;
      toast.success('تم تحديث المعلومة بنجاح');
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error updating AI knowledge:', error);
      toast.error('فشل تحديث المعلومة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المعلومة؟')) return;
    try {
      const { error } = await supabase.from('ai_knowledge').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف المعلومة بنجاح');
      fetchKnowledge();
    } catch (error: any) {
      console.error('Error deleting AI knowledge:', error);
      toast.error('فشل حذف المعلومة: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      category: '', title: '', content: '', keywords: [], priority: 0, is_active: true
    });
    setNewKeyword('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white">إدارة قاعدة معرفة AI</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معلومة</span>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'تعديل المعلومة' : 'إضافة معلومة جديدة لتدريب AI'}</DialogTitle>
              <DialogDescription>
                أضف معلومات لتدريب المرشد التقني على الإجابة عليها
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Input
                    value={editingItem ? editingItem.category : newItem.category}
                    onChange={(e) => editingItem
                      ? setEditingItem({ ...editingItem, category: e.target.value })
                      : setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="text-right"
                    placeholder="مثال: إجراءات، معلومات عامة، قوانين"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Input
                    type="number"
                    value={editingItem ? editingItem.priority : newItem.priority}
                    onChange={(e) => editingItem
                      ? setEditingItem({ ...editingItem, priority: parseInt(e.target.value) || 0 })
                      : setNewItem({ ...newItem, priority: parseInt(e.target.value) || 0 })
                    }
                    className="text-right"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  value={editingItem ? editingItem.title : newItem.title}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, title: e.target.value })
                    : setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="text-right"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">المحتوى *</Label>
                <Textarea
                  value={editingItem ? editingItem.content : newItem.content}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, content: e.target.value })
                    : setNewItem({ ...newItem, content: e.target.value })
                  }
                  className="text-right"
                  rows={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>الكلمات المفتاحية</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newKeyword.trim()) {
                        const current = editingItem || newItem;
                        const keywords = [...(current.keywords || []), newKeyword.trim()];
                        if (editingItem) {
                          setEditingItem({ ...editingItem, keywords });
                        } else {
                          setNewItem({ ...newItem, keywords });
                        }
                        setNewKeyword('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة
                  </Button>
                </div>
                <Input
                  placeholder="كلمة مفتاحية"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="text-right"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newKeyword.trim()) {
                      const current = editingItem || newItem;
                      const keywords = [...(current.keywords || []), newKeyword.trim()];
                      if (editingItem) {
                        setEditingItem({ ...editingItem, keywords });
                      } else {
                        setNewItem({ ...newItem, keywords });
                      }
                      setNewKeyword('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingItem?.keywords || newItem.keywords || []).map((keyword: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                      <span>{keyword}</span>
                      <button
                        onClick={() => {
                          const current = editingItem || newItem;
                          const keywords = (current.keywords || []).filter((_: string, i: number) => i !== index);
                          if (editingItem) {
                            setEditingItem({ ...editingItem, keywords });
                          } else {
                            setNewItem({ ...newItem, keywords });
                          }
                        }}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingItem ? editingItem.is_active : newItem.is_active}
                  onChange={(e) => editingItem
                    ? setEditingItem({ ...editingItem, is_active: e.target.checked })
                    : setNewItem({ ...newItem, is_active: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">نشط (سيظهر في نتائج البحث)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>إلغاء</Button>
              <Button
                onClick={editingItem ? handleEditItem : handleAddItem}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الفئة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">العنوان</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الكلمات المفتاحية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الأولوية</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">الحالة</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-gray-100">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">جاري التحميل...</td></tr>
            ) : knowledge.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">لا توجد معلومات</td></tr>
            ) : (
              knowledge.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(item.keywords || []).slice(0, 3).map((keyword: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                      {(item.keywords || []).length > 3 && (
                        <span className="text-xs text-gray-500">+{(item.keywords || []).length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{item.priority}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {item.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsManagement() {
  return (
    <div>
      <h1 className="text-3xl mb-8 text-gray-900 dark:text-white">
        الإعدادات
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
          <CardDescription>جاري العمل على هذه الميزة</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
