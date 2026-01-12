
import express from 'express';
import fs from 'fs';
import { OpenRouter } from '@openrouter/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY are required in .env file');
    console.error('Please create a .env file in the project root with:');
    console.error('  SUPABASE_URL=https://your-project.supabase.co');
    console.error('  SUPABASE_ANON_KEY=your-anon-key');
    console.error('  OPENROUTER_API_KEY=your-openrouter-key');
    console.error('\nSee server/SETUP_ENV.md for detailed instructions.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173', // Local frontend URL
        'X-Title': 'Tafila Technical University Platform',
    },
});

// Function to search for relevant knowledge based on keywords
function findRelevantKnowledge(message, knowledgeBase) {
    const messageLower = message.toLowerCase();
    const relevant = [];

    knowledgeBase.forEach(item => {
        let score = 0;

        // Check if message contains any keywords
        if (item.keywords && item.keywords.length > 0) {
            item.keywords.forEach(keyword => {
                if (messageLower.includes(keyword.toLowerCase())) {
                    score += 2; // Higher weight for keyword matches
                }
            });
        }

        // Check if message contains words from title
        const titleWords = item.title.toLowerCase().split(/\s+/);
        titleWords.forEach(word => {
            if (word.length > 3 && messageLower.includes(word)) {
                score += 1;
            }
        });

        // Check if message contains words from category
        if (messageLower.includes(item.category.toLowerCase())) {
            score += 1.5;
        }

        if (score > 0) {
            relevant.push({ ...item, score: score + item.priority });
        }
    });

    // Sort by score (highest first) and return top 10
    return relevant.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Function to build comprehensive knowledge base
async function buildKnowledgeBase() {
    try {
        // Get all active knowledge from ai_knowledge table
        const { data: aiKnowledge, error: aiError } = await supabase
            .from('ai_knowledge')
            .select('*')
            .eq('is_active', true)
            .order('priority', { ascending: false });

        if (aiError) {
            console.error('Error fetching AI knowledge:', aiError);
        }

        // Get courses information
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('name, code, description, department, faculty')
            .limit(50); // Limit to avoid too much data

        if (coursesError) {
            console.error('Error fetching courses:', coursesError);
        }

        // Get procedures information
        const { data: procedures, error: proceduresError } = await supabase
            .from('procedures')
            .select('title, description, category')
            .limit(30);

        if (proceduresError) {
            console.error('Error fetching procedures:', proceduresError);
        }

        // Get study plans information with plan_data (JSON) for AI training
        const { data: studyPlans, error: studyPlansError } = await supabase
            .from('study_plans')
            .select('major_name, major_code, department, college, total_credit_hours, years, plan_data, description')
            .limit(20);

        if (studyPlansError) {
            console.error('Error fetching study plans:', studyPlansError);
        }

        return {
            aiKnowledge: aiKnowledge || [],
            courses: courses || [],
            procedures: procedures || [],
            studyPlans: studyPlans || []
        };
    } catch (error) {
        console.error('Error building knowledge base:', error);
        return {
            aiKnowledge: [],
            courses: [],
            procedures: [],
            studyPlans: []
        };
    }
}

router.post('/', async (req, res) => {
    const { message } = req.body;

    try {
        // Build knowledge base from Supabase
        const knowledgeBase = await buildKnowledgeBase();

        // Find relevant knowledge for the current message
        const relevantKnowledge = findRelevantKnowledge(message, knowledgeBase.aiKnowledge);

        // Build comprehensive system prompt
        let systemPrompt = `أنت المرشد التقني الذكي لمنصة مرشد تقني - جامعة الطفيلة التقنية. مهمتك هي مساعدة الطلاب في الإجابة على استفساراتهم حول المواد الدراسية، الإجراءات الإدارية، الخطط الدراسية، والموقع الجغرافي للجامعة.

تعليمات هامة:
1. أجب باللغة العربية دائمًا.
2. كن مهذباً ومحترماً ومتعاوناً.
3. استخدم المعلومات المخصصة من قاعدة المعرفة عند الإجابة.
4. إذا سألك الطالب عن شيء لا تعرفه، قل "عذراً، لا أملك معلومات كافية حول هذا الموضوع حالياً. يمكنك مراجعة موقع الجامعة الرسمي أو التواصل مع الإدارة."
5. استخدم معلومات دقيقة حول الجامعة إذا توفرت لديك، أو قدم نصائح عامة مفيدة للطلاب الجامعيين.
6. عند الإجابة على أسئلة حول المواد الدراسية، استخدم المعلومات المتاحة من قاعدة البيانات.
7. عند الإجابة على أسئلة حول الإجراءات، استخدم المعلومات من قسم الإجراءات.
8. عند الإجابة على أسئلة حول الخطط الدراسية، استخدم المعلومات من قسم الخطط الدراسية.

`;

        // Read data.md and curse.md for additional local knowledge
        const dataPath = join(process.cwd(), 'data.md');
        const cursePath = join(process.cwd(), 'curse.md');
        let localData = '';
        let courseLinksData = '';

        try {
            if (fs.existsSync(dataPath)) {
                localData = fs.readFileSync(dataPath, 'utf-8');
            }
            if (fs.existsSync(cursePath)) {
                courseLinksData = fs.readFileSync(cursePath, 'utf-8');
            }
        } catch (err) {
            console.error('Error reading local data files:', err);
        }

        // Add AI Knowledge (Custom Training Data)
        if (relevantKnowledge.length > 0) {
            systemPrompt += `\n=== معلومات مخصصة من قاعدة المعرفة (ذات صلة بالسؤال) ===\n`;
            relevantKnowledge.forEach((item, index) => {
                systemPrompt += `\n[${index + 1}] الفئة: ${item.category}\n`;
                systemPrompt += `العنوان: ${item.title}\n`;
                systemPrompt += `المحتوى: ${item.content}\n`;
                if (item.keywords && item.keywords.length > 0) {
                    systemPrompt += `الكلمات المفتاحية: ${item.keywords.join(', ')}\n`;
                }
                systemPrompt += `---\n`;
            });
        } else if (knowledgeBase.aiKnowledge.length > 0) {
            // If no relevant knowledge found, include top priority items
            const topKnowledge = knowledgeBase.aiKnowledge.slice(0, 5);
            systemPrompt += `\n=== معلومات عامة من قاعدة المعرفة ===\n`;
            topKnowledge.forEach((item, index) => {
                systemPrompt += `\n[${index + 1}] ${item.title}: ${item.content}\n`;
            });
        }

        // Add Course Links Data
        if (courseLinksData) {
            systemPrompt += `\n=== روابط المواد المباشرة ===\n`;
            systemPrompt += `عندما يكتب الطالب اسم مادة من القائمة التالية، يجب عليك تزويده بالرابط المخصص لها بشكل واضح وجذاب:\n`;
            systemPrompt += courseLinksData;
            systemPrompt += `\nتعليمات للروابط: استخدم صيغة "يمكنك الوصول لصفحة المادة من خلال الرابط التالي: [اسم المادة](الرابط)"\n`;
            systemPrompt += `------------------------------------------------\n`;
        }

        // Add Local Data Only if available
        if (localData) {
            systemPrompt += `\n=== بيانات إضافية شاملة (خطط دراسية، تخصصات، وإجراءات) ===\n`;
            systemPrompt += `تحتوي البيانات التالية على تفاصيل التخصصات، المواد، والإجراءات الجامعية. استخدمها كمرجع أساسي للإجابة:\n`;
            systemPrompt += localData;
            systemPrompt += `\n------------------------------------------------\n`;
        }

        // Add Courses Information
        if (knowledgeBase.courses.length > 0) {
            systemPrompt += `\n=== معلومات المواد الدراسية المتاحة (من قاعدة البيانات) ===\n`;
            knowledgeBase.courses.slice(0, 20).forEach((course, index) => {
                systemPrompt += `\n[${index + 1}] ${course.code} - ${course.name}`;
                if (course.department) systemPrompt += ` (${course.department})`;
                if (course.description) systemPrompt += `: ${course.description.substring(0, 100)}`;
                systemPrompt += `\n`;
            });
        }

        // Add Procedures Information
        if (knowledgeBase.procedures.length > 0) {
            systemPrompt += `\n=== معلومات الإجراءات الإدارية (من قاعدة البيانات) ===\n`;
            knowledgeBase.procedures.slice(0, 15).forEach((proc, index) => {
                systemPrompt += `\n[${index + 1}] ${proc.title}`;
                if (proc.category) systemPrompt += ` (${proc.category})`;
                if (proc.description) systemPrompt += `: ${proc.description.substring(0, 100)}`;
                systemPrompt += `\n`;
            });
        }

        // Add Study Plans Information with detailed JSON data for AI training
        if (knowledgeBase.studyPlans.length > 0) {
            systemPrompt += `\n=== معلومات الخطط الدراسية (من قاعدة البيانات) ===\n`;
            knowledgeBase.studyPlans.slice(0, 10).forEach((plan, index) => {
                systemPrompt += `\n[${index + 1}] التخصص: ${plan.major_code} - ${plan.major_name}`;
                if (plan.department) systemPrompt += `\n   القسم: ${plan.department}`;
                if (plan.college) systemPrompt += `\n   الكلية: ${plan.college}`;
                if (plan.total_credit_hours) systemPrompt += `\n   إجمالي الساعات: ${plan.total_credit_hours} ساعة معتمدة`;
                if (plan.years) systemPrompt += `\n   مدة الدراسة: ${plan.years} سنوات`;
                if (plan.description) systemPrompt += `\n   الوصف: ${plan.description}`;

                // Add detailed plan_data (JSON) for AI training
                if (plan.plan_data && Array.isArray(plan.plan_data) && plan.plan_data.length > 0) {
                    systemPrompt += `\n   تفاصيل الخطة الدراسية:\n`;
                    plan.plan_data.forEach((yearData, yearIndex) => {
                        systemPrompt += `      السنة ${yearData.year || yearIndex + 1}:`;
                        if (yearData.semester) systemPrompt += ` ${yearData.semester}`;
                        systemPrompt += `\n`;

                        if (yearData.courses && Array.isArray(yearData.courses)) {
                            yearData.courses.forEach((course, courseIndex) => {
                                systemPrompt += `         - ${course.code || course.name || `مادة ${courseIndex + 1}`}`;
                                if (course.name && course.code) systemPrompt += `: ${course.name}`;
                                if (course.hours) systemPrompt += ` (${course.hours} ساعة)`;
                                systemPrompt += `\n`;
                            });
                        }
                    });
                }
                systemPrompt += `\n`;
            });
        }

        systemPrompt += `\n=== ملاحظات مهمة ===\n`;
        systemPrompt += `- استخدم المعلومات أعلاه للإجابة على أسئلة الطلاب بدقة.\n`;
        systemPrompt += `- إذا كان السؤال يتعلق بمادة دراسية محددة، ابحث في قائمة المواد الدراسية أو البيانات الإضافية.\n`;
        systemPrompt += `- إذا كان السؤال يتعلق بإجراء إداري، ابحث في قائمة الإجراءات أو البيانات الإضافية.\n`;
        systemPrompt += `- إذا كان السؤال يتعلق بخطة دراسية أو تخصص معين:\n`;
        systemPrompt += `  * استخدم بيانات JSON التفصيلية من plan_data أو البيانات الإضافية للإجابة بدقة\n`;
        systemPrompt += `  * اذكر المواد الدراسية لكل سنة وفصل\n`;
        systemPrompt += `  * اذكر الساعات المعتمدة لكل مادة\n`;
        systemPrompt += `  * قدم معلومات شاملة عن الخطة الدراسية بناءً على البيانات المتاحة\n`;
        systemPrompt += `- المعلومات المخصصة من قاعدة المعرفة والبيانات الإضافية لها أولوية عالية في الإجابة.\n`;
        systemPrompt += `- عند الإجابة على أسئلة حول الخطط الدراسية، استخدم البيانات التفصيلية بدقة.\n`;

        // Call OpenRouter API with enhanced system prompt
        const completion = await openRouter.chat.send({
            model: 'tngtech/deepseek-r1t2-chimera:free',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const botResponse = completion.choices[0]?.message?.content || "عذراً، لم أتمكن من الحصول على رد من الخادم.";

        res.json({ response: botResponse });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
