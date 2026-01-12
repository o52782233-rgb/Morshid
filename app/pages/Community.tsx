import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { MessageSquare, Heart, Share2, MoreHorizontal, Send } from 'lucide-react';

interface Post {
    id: string;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    comments: number;
    timestamp: string;
}

export default function Community() {
    const [posts, setPosts] = useState<Post[]>([
        {
            id: '1',
            author: 'أحمد محمد',
            avatar: 'AM',
            content: 'يا شباب متى موعد التسجيل للمواد الحرة؟',
            likes: 12,
            comments: 5,
            timestamp: 'منذ ساعتين'
        },
        {
            id: '2',
            author: 'سارة علي',
            avatar: 'SA',
            content: 'مين منزل مادة ذكاء اصطناعي مع الدكتور خالد؟ كيف المادة؟',
            likes: 8,
            comments: 15,
            timestamp: 'منذ 4 ساعات'
        }
    ]);
    const [newPost, setNewPost] = useState('');

    const handlePost = () => {
        if (!newPost.trim()) return;

        setPosts([
            {
                id: Date.now().toString(),
                author: 'أنت',
                avatar: 'ME',
                content: newPost,
                likes: 0,
                comments: 0,
                timestamp: 'الآن'
            },
            ...posts
        ]);
        setNewPost('');
    };

    return (
        <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-2xl mx-auto px-4">
                {/* New Post Input */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <Avatar>
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="شاركي زملائك أفكارك أو استفساراتك..."
                                    className="mb-4 resize-none"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">سيتم نشر المنشور لجميع طلاب الجامعة</span>
                                    <Button onClick={handlePost}>
                                        <Send className="w-4 h-4 ml-2" />
                                        نشر
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feed */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback>{post.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{post.author}</CardTitle>
                                            <CardDescription>{post.timestamp}</CardDescription>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center gap-6 pt-4 border-t dark:border-gray-800">
                                            <Button variant="ghost" className="text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Heart className="w-5 h-5 ml-2" />
                                                {post.likes}
                                            </Button>
                                            <Button variant="ghost" className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                <MessageSquare className="w-5 h-5 ml-2" />
                                                {post.comments}
                                            </Button>
                                            <Button variant="ghost" className="ml-auto text-gray-600">
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
