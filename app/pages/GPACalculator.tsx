import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    hours: number;
    grade: number;
}

export default function GPACalculator() {
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: '1', name: 'المادة 1', hours: 3, grade: 0 },
        { id: '2', name: 'المادة 2', hours: 3, grade: 0 },
        { id: '3', name: 'المادة 3', hours: 3, grade: 0 },
    ]);
    const [semesterGPA, setSemesterGPA] = useState<number | null>(null);

    // Cumulative Calculation State
    const [prevHours, setPrevHours] = useState('');
    const [prevGPA, setPrevGPA] = useState('');
    const [cumulativeGPA, setCumulativeGPA] = useState<number | null>(null);

    const addSubject = () => {
        setSubjects([
            ...subjects,
            { id: Date.now().toString(), name: `المادة ${subjects.length + 1}`, hours: 3, grade: 0 }
        ]);
    };

    const removeSubject = (id: string) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
        setSubjects(subjects.map(s => {
            if (s.id === id) {
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const calculate = () => {
        let totalPoints = 0;
        let totalHours = 0;

        subjects.forEach(s => {
            totalPoints += s.grade * s.hours;
            totalHours += Number(s.hours);
        });

        const semGPA = totalHours > 0 ? totalPoints / totalHours : 0;
        setSemesterGPA(semGPA);

        if (prevHours && prevGPA) {
            const prevH = Number(prevHours);
            const prevG = Number(prevGPA);

            const totalCumulativePoints = (prevH * prevG) + totalPoints;
            const totalCumulativeHours = prevH + totalHours;

            setCumulativeGPA(totalCumulativeHours > 0 ? totalCumulativePoints / totalCumulativeHours : 0);
        } else {
            setCumulativeGPA(semGPA);
        }
    };

    return (
        <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white font-bold mb-2">
                        حاسبة المعدل التراكمي
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        احسب معدلك الفصلي والتراكمي بدقة وسهولة
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Calculator */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>مواد الفصل الحالي</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {subjects.map((subject, index) => (
                                        <motion.div
                                            key={subject.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-4 items-end bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <Label className="mb-2 block text-xs">اسم المادة</Label>
                                                <Input
                                                    value={subject.name}
                                                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label className="mb-2 block text-xs">الساعات</Label>
                                                <Input
                                                    type="number"
                                                    value={subject.hours}
                                                    onChange={(e) => updateSubject(subject.id, 'hours', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label className="mb-2 block text-xs">العلامة</Label>
                                                <Input
                                                    type="number"
                                                    value={subject.grade}
                                                    onChange={(e) => updateSubject(subject.id, 'grade', Number(e.target.value))}
                                                />
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeSubject(subject.id)}
                                                className="mb-0.5"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                <Button
                                    onClick={addSubject}
                                    variant="outline"
                                    className="w-full mt-4 border-dashed"
                                >
                                    <Plus className="w-4 h-4 ml-2" />
                                    إضافة مادة
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>معلومات سابقة (اختياري)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-2 block">الساعات المقطوعة سابقاً</Label>
                                        <Input
                                            type="number"
                                            placeholder="مثلاً: 60"
                                            value={prevHours}
                                            onChange={(e) => setPrevHours(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">المعدل التراكمي السابق</Label>
                                        <Input
                                            type="number"
                                            placeholder="مثلاً: 75.5"
                                            value={prevGPA}
                                            onChange={(e) => setPrevGPA(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div className="sticky top-24 space-y-6">
                            <Button
                                onClick={calculate}
                                size="lg"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            >
                                <Calculator className="w-5 h-5 ml-2" />
                                احسب النتيجة
                            </Button>

                            {semesterGPA !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring' }}
                                >
                                    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
                                        <CardContent className="p-6 text-center">
                                            <p className="text-blue-100 mb-2">المعدل الفصلي</p>
                                            <div className="text-5xl font-bold mb-4">
                                                {semesterGPA.toFixed(2)}
                                            </div>

                                            {cumulativeGPA !== null && (
                                                <div className="pt-4 border-t border-white/20">
                                                    <p className="text-blue-100 mb-1 text-sm">المعدل التراكمي المتوقع</p>
                                                    <div className="text-3xl font-bold flex items-center justify-center gap-2">
                                                        <TrendingUp className="w-6 h-6" />
                                                        {cumulativeGPA.toFixed(2)}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
