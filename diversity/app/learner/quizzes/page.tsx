'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Brain,
    Trophy,
    Timer,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Play,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
    AlertCircle,
    Hourglass,
    Target,
    Zap,
    GraduationCap,
    Lightbulb,
    Search,
    BookOpen,
    Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { toast } from 'sonner'

export default function LearnerQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeQuiz, setActiveQuiz] = useState<any>(null)
    const [quizState, setQuizState] = useState<'IDLE' | 'TAKING' | 'RESULT'>('IDLE')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [startedAt, setStartedAt] = useState<string | null>(null)
    const [lastResult, setLastResult] = useState<any>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await api.get('/learners/me/quizzes')
                setQuizzes(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Failed to fetch quizzes:', err)
                toast.error('Failed to load quizzes')
            } finally {
                setLoading(false)
            }
        }
        fetchQuizzes()
    }, [])

    const startQuiz = (quiz: any) => {
        setActiveQuiz(quiz)
        setQuizState('TAKING')
        setCurrentQuestionIndex(0)
        setAnswers({})
        setStartedAt(new Date().toISOString())
    }

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < activeQuiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const submitQuiz = async () => {
        if (Object.keys(answers).length < activeQuiz.questions.length) {
            toast.warning('Please answer all questions before submitting.')
            return
        }

        setSubmitting(true)
        try {
            const result = await api.post(`/quizzes/${activeQuiz.id}/submit`, {
                answers,
                startedAt
            })
            setLastResult(result)
            setQuizState('RESULT')
            // Update local quizzes list with the new result
            setQuizzes(prev => prev.map(q => 
                q.id === activeQuiz.id ? { ...q, results: [result] } : q
            ))
        } catch (err) {
            console.error('Submission failed:', err)
            toast.error('Failed to submit quiz results')
        } finally {
            setSubmitting(false)
        }
    }

    if (quizState === 'TAKING') {
        const question = activeQuiz.questions[currentQuestionIndex]
        const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100

        return (
            <DashboardLayout role="LEARNER">
                <div className="max-w-4xl mx-auto py-8 space-y-8">
                    {/* Quiz Progress Header */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" className="gap-2" onClick={() => setQuizState('IDLE')}>
                                <XCircle className="w-5 h-5 text-slate-400" />
                                Exit Quiz
                            </Button>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="h-8 border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                                </Badge>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <Timer className="w-4 h-4" />
                                    00:00 {/* Timer placeholder */}
                                </div>
                            </div>
                        </div>
                        <Progress value={progress} className="h-2 bg-slate-100" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="rounded-[2.5rem] shadow-2xl border-none p-12 space-y-12 bg-white ring-1 ring-slate-100">
                                <div className="space-y-6">
                                    <div className="inline-flex p-4 bg-blue-50 rounded-2xl text-blue-600">
                                        <Lightbulb className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                        {question.question}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {question.options && Object.entries(question.options as Record<string, string>).map(([key, value]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleAnswer(question.id, key)}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between group",
                                                answers[question.id] === key 
                                                    ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-50" 
                                                    : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors",
                                                    answers[question.id] === key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                                )}>
                                                    {key.toUpperCase()}
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-lg",
                                                    answers[question.id] === key ? "text-blue-900" : "text-slate-600"
                                                )}>{value}</span>
                                            </div>
                                            {answers[question.id] === key && (
                                                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-4">
                        <Button 
                            variant="outline" 
                            className="h-14 px-8 rounded-2xl border-2 gap-2 font-black"
                            disabled={currentQuestionIndex === 0}
                            onClick={prevQuestion}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Previous
                        </Button>
                        
                        {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                            <Button 
                                className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-2 shadow-xl shadow-slate-200"
                                onClick={submitQuiz}
                                disabled={submitting}
                            >
                                {submitting ? 'Calculating...' : 'Submit Assessment'}
                                <Trophy className="w-5 h-5 text-amber-400" />
                            </Button>
                        ) : (
                            <Button 
                                className="h-14 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg gap-2 shadow-xl shadow-blue-200"
                                onClick={nextQuestion}
                            >
                                Next Question
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (quizState === 'RESULT') {
        const passed = lastResult.passed
        return (
            <DashboardLayout role="LEARNER">
                <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 w-full"
                    >
                        <div className={cn(
                            "w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative",
                            passed ? "bg-emerald-500 shadow-emerald-200" : "bg-red-500 shadow-red-200"
                        )}>
                            {passed ? <BadgeCheck className="w-16 h-16 text-white" /> : <AlertCircle className="w-16 h-16 text-white" />}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Star className={cn("w-6 h-6", passed ? "text-amber-500" : "text-slate-300")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-900">
                                {passed ? 'Great Work, Champion!' : 'Keep Pushing Forward!'}
                            </h2>
                            <p className="text-slate-500 text-lg font-medium">
                                {passed ? 'You have successfully mastered this assessment with flying colors.' : "You're getting there! A little more study and you'll crush it."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Your Score</p>
                                <p className={cn("text-5xl font-black", passed ? "text-emerald-600" : "text-red-600")}>{lastResult.score}%</p>
                            </div>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Status</p>
                                <p className={cn("text-2xl font-black uppercase flex items-center justify-center gap-2 h-[60px]", passed ? "text-emerald-600" : "text-red-600")}>
                                    {passed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                    {passed ? 'Passed' : 'Failed'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Button 
                                className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-2 w-full sm:w-auto"
                                onClick={() => setQuizState('IDLE')}
                            >
                                Back to Dashboard
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-16 px-10 rounded-2xl border-2 font-black text-lg gap-2 w-full sm:w-auto"
                                onClick={() => startQuiz(activeQuiz)}
                            >
                                <RotateCcw className="w-5 h-5" />
                                Retake Quiz
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="LEARNER">
            <div className="max-w-7xl mx-auto space-y-12 pb-24">
                {/* Header */}
                <div className="text-center space-y-4 pt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        <Brain className="w-4 h-4" />
                        Skills Mastery
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Knowledge <span className="text-purple-600">Assessments</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Validate your learning and unlock certificates by completing course-specific quizzes.
                    </p>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest">Scanning your curriculum...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {quizzes.length > 0 ? quizzes.map((quiz) => {
                            const result = quiz.results?.[0]
                            const passed = result?.passed
                            const hasAttempt = !!result

                            return (
                                <motion.div key={quiz.id} whileHover={{ y: -5 }}>
                                    <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 group">
                                        <CardHeader className="p-8 pb-0">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                                    <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                                </div>
                                                {hasAttempt && (
                                                    <Badge className={cn(
                                                        "font-black uppercase tracking-widest text-[10px]",
                                                        passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {passed ? 'Passed' : 'Failed'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{quiz.course.title}</p>
                                                <CardTitle className="text-2xl font-black">{quiz.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <p className="text-slate-500 font-medium line-clamp-2">{quiz.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Questions</p>
                                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <Target className="w-4 h-4 text-blue-500" />
                                                        {quiz.questions.length}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pass Score</p>
                                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <Zap className="w-4 h-4 text-amber-500" />
                                                        {quiz.passingScore}%
                                                    </div>
                                                </div>
                                            </div>

                                            {hasAttempt && (
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Attempt</p>
                                                        <span className={cn("font-black text-sm", passed ? "text-emerald-600" : "text-red-600")}>{result.score}%</span>
                                                    </div>
                                                    <Progress value={result.score} className={cn("h-1.5", passed ? "bg-emerald-100" : "bg-red-100")} />
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="px-8 pb-8 pt-0">
                                            <Button 
                                                className={cn(
                                                    "w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-lg transition-all",
                                                    hasAttempt && passed ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"
                                                )}
                                                onClick={() => startQuiz(quiz)}
                                            >
                                                {hasAttempt && passed ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                                                {hasAttempt && passed ? 'Retake Assessment' : 'Start Quiz'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            )
                        }) : (
                            <div className="col-span-full py-24 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto">
                                    <BookOpen className="w-12 h-12 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Quizzes Available</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto font-medium">Enroll in courses to unlock related knowledge assessments and earn your expertise badges.</p>
                                </div>
                                <Button className="rounded-2xl h-14 px-8 font-black gap-2 text-lg shadow-xl shadow-blue-500/20" onClick={() => (window.location.href = '/learner/courses')}>
                                    Browse Catalog
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
