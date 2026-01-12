import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Mail, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
}

export default function Faculty() {
  const [searchQuery, setSearchQuery] = useState('');

  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data, error } = await supabase.from('faculty').select('*');
        if (error) throw error;
        // Map database fields to interface if necessary (or update interface)
        const mappedData: FacultyMember[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          title: item.title,
          department: item.department,
          email: item.email || '',
          phone: item.phone || '', // Need to add phone to table if requested, or make optional
          specialization: item.specialization || '' // Add to table
        }));
        setFacultyMembers(mappedData);
      } catch (error) {
        console.error('Error fetching faculty', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const filteredMembers = facultyMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl mb-4 text-gray-900 dark:text-white">
            الهيئة التدريسية
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            تعرف على أعضاء الهيئة التدريسية في الجامعة
          </p>
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
              placeholder="ابحث عن عضو هيئة تدريس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 py-6 text-lg"
            />
          </div>
        </motion.div>

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                      <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription>{member.title}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {member.department}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">التخصص:</span> {member.specialization}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-20">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              لم يتم العثور على أعضاء هيئة تدريس
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
