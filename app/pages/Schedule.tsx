import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const TIMES = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

// Mock Data for Schedule
const SCHEDULE_ITEMS = [
    { id: 1, subject: 'برمجة ويب', day: 'الأحد', start: '9:00', duration: 1, room: '304', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { id: 2, subject: 'قواعد بيانات', day: 'الأحد', start: '11:00', duration: 1.5, room: '201', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
    { id: 3, subject: 'ذكاء اصطناعي', day: 'الاثنين', start: '10:00', duration: 1, room: 'LAB-2', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
    { id: 4, subject: 'برمجة ويب', day: 'الثلاثاء', start: '9:00', duration: 1, room: '304', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { id: 5, subject: 'قواعد بيانات', day: 'الثلاثاء', start: '11:00', duration: 1.5, room: '201', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
];

export default function Schedule() {
    return (
        <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2 dark:text-white">الجدول الدراسي</h1>
                    <p className="text-gray-600 dark:text-gray-400">جدول محاضراتك الأسبوعي (تجريبي)</p>
                </motion.div>

                <Card className="overflow-hidden">
                    <CardHeader className="border-b dark:border-gray-700">
                        <CardTitle>الفصل الأول 2024/2025</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-10 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                                <div className="p-4 font-semibold text-center border-l dark:border-gray-700">الوقت / اليوم</div>
                                {TIMES.map(time => (
                                    <div key={time} className="p-4 font-semibold text-center text-sm border-l dark:border-gray-700 last:border-0">
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Days Rows */}
                            {DAYS.map((day) => (
                                <div key={day} className="grid grid-cols-10 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="p-4 font-semibold flex items-center justify-center bg-gray-50 dark:bg-gray-800/80 border-l dark:border-gray-700">
                                        {day}
                                    </div>
                                    {/* Grid Cells for Times - Logic to span cells would go here. For simplicity, we just check if an event starts here */}
                                    {TIMES.map((time) => {
                                        const item = SCHEDULE_ITEMS.find(i => i.day === day && i.start === time);

                                        if (item) {
                                            return (
                                                <div key={time} className="p-1 col-span-1 relative z-10">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className={`h-full w-full rounded-md p-2 text-xs font-medium shadow-sm border border-black/5 ${item.color}`}
                                                    >
                                                        <div className="font-bold text-sm mb-1">{item.subject}</div>
                                                        <div className="opacity-80">Q: {item.room}</div>
                                                    </motion.div>
                                                </div>
                                            );
                                        }

                                        // Check if this time slot is "covered" by a multi-hour class starting earlier
                                        // Simplified: We assume 1 hour slots for the grid cells, visually creating gaps if something spans.
                                        // For a real production app, we'd calculate col-span based on duration.

                                        return <div key={time} className="p-4 border-l dark:border-gray-700 last:border-0"></div>;
                                    })}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
