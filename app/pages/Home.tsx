import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  BookOpen,
  Users,
  FileText,
  MessageCircle,
  GraduationCap,
  TrendingUp,
  Award,
  Target,
  Calculator
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, memo } from 'react';

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

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'مكتبة إلكترونية شاملة',
      description: 'جميع المواد الدراسية مع محتواها الكامل في مكان واحد',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'معلومات الهيئة التدريسية',
      description: 'تعرف على أساتذتك ومعلوماتهم الأكاديمية',
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'الإجراءات والمعاملات',
      description: 'دليل شامل لجميع الإجراءات الورقية والإدارية',
      color: 'bg-purple-500',
    },
    {
      icon: MessageCircle,
      title: 'المرشد التقني الذكي',
      description: 'شات بوت ذكي مدعوم بالذكاء الاصطناعي للإجابة على استفساراتك',
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    { icon: GraduationCap, value: '4+', label: 'كلية' },
    { icon: BookOpen, value: '10+', label: 'مادة دراسية' },
    { icon: Users, value: '3+', label: 'عضو هيئة تدريس' },
    { icon: Award, value: '24/7', label: 'دعم متواصل' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - نفس تصميم CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 via-purple-600 to-blue-500 text-white py-20 sm:py-24 md:py-28 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background Circles - نفس تصميم CTA */}
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
          
          {/* Stars Effect - نفس تصميم CTA */}
          <StarsBackground />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            {/* Logo in Hero - نفس تصميم CTA */}
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
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl p-4"
            >
              <img
                src="/images/logo.jpeg"
                alt="منصة مرشد تقني"
                className="w-full h-full object-contain rounded-full"
              />
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
              منصة مرشد تقني
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed"
            >
              بوابتك الذكية للنجاح الأكاديمي
              <br />
              <span className="text-blue-200">الخطط الدراسية، المكتبة الإلكترونية، والمرشد التقني الذكي</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/library">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="text-lg px-10 h-14 bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all font-bold">
                    <BookOpen className="ml-2 w-5 h-5" />
                    المكتبة الإلكترونية
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mr-2"
                    >
                      ←
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/chatbot">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="text-lg px-10 h-14 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-2xl hover:shadow-3xl transition-all font-bold">
                    <MessageCircle className="ml-2 w-5 h-5" />
                    المرشد الذكي
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mr-2"
                    >
                      ←
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Tools Section - Enhanced */}
      <section className="py-12 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link to="/gpa-calculator">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-green-500/50 hover:shadow-2xl transition-all overflow-hidden relative"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <Calculator className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">حاسبة المعدل</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">احسب معدلك الفصلي والتراكمي</p>
                </div>
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.div>
            </Link>

            <Link to="/schedule">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-purple-500/50 hover:shadow-2xl transition-all overflow-hidden relative"
              >
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <FileText className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">الجدول الدراسي</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تابع محاضراتك وأوقاتك</p>
                </div>
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.div>
            </Link>

            <Link to="/community">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-orange-500/50 hover:shadow-2xl transition-all overflow-hidden relative"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="p-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">مجتمع الطلاب</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تواصل مع زملائك</p>
                </div>
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              إحصائيات المنصة
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              أرقام تدل على حجم وإمكانيات المنصة
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600',
              ];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="relative group"
                >
                  <Card className="h-full overflow-hidden border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-2xl">
                    <CardContent className="p-6 text-center relative z-10 bg-white dark:bg-gray-800">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2,
                        }}
                        className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </CardContent>
                    <motion.div
                      animate={{
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${colors[index]} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              animate={{
                textShadow: [
                  '0 0 10px rgba(59, 130, 246, 0.3)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 10px rgba(59, 130, 246, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              ميزات المنصة
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              نوفر لك كل ما تحتاجه لتجربة أكاديمية متميزة وإثراء معرفتك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const gradients = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600',
              ];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 80,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <Card className="h-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-2xl">
                    <CardHeader className="relative">
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3,
                        }}
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow relative z-10`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} rounded-xl blur-lg`}
                        />
                      </motion.div>
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white overflow-hidden">
        {/* Animated Background */}
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
          
          {/* Stars Effect */}
          {typeof window !== 'undefined' && [...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
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
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h2
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
              ابدأ رحلتك الأكاديمية الآن
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed"
            >
              انضم إلينا واستفد من جميع الموارد والخدمات المتاحة لتحقيق أهدافك الأكاديمية
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="text-lg px-10 h-14 bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all font-bold">
                    إنشاء حساب مجاني
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mr-2"
                    >
                      ←
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}