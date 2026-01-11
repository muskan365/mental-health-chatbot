import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, ClipboardList, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { assessmentService } from "@/services/assessment.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const phq9Questions = [
  "How often have you had little interest or pleasure in doing things?",
  "How often have you felt down, depressed, or hopeless?",
  "How often have you had trouble falling or staying asleep, or sleeping too much?",
  "How often have you felt tired or had little energy?",
  "How often have you had a poor appetite or been overeating?",
  "How often have you felt bad about yourself — or that you are a failure?",
  "How often have you had trouble concentrating on things?",
  "How often have you been moving or speaking slowly, or feeling fidgety/restless?",
  "How often have you had thoughts that you would be better off dead, or of hurting yourself?",
];

const gad7Questions = [
  "How often have you felt nervous, anxious, or on edge?",
  "How often have you been unable to stop or control worrying?",
  "How often have you worried too much about different things?",
  "How often have you had trouble relaxing?",
  "How often have you been so restless that it's hard to sit still?",
  "How often have you become easily annoyed or irritable?",
  "How often have you felt afraid as if something awful might happen?",
];

const phq9Options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

const gad7Options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

type AssessmentType = "phq9" | "gad7";

const Assessment = () => {
  const [activeTab, setActiveTab] = useState<AssessmentType>("phq9");
  const [phq9CurrentQuestion, setPhq9CurrentQuestion] = useState(0);
  const [phq9Answers, setPhq9Answers] = useState<number[]>(Array(phq9Questions.length).fill(-1));
  const [phq9Complete, setPhq9Complete] = useState(false);
  const [phq9Score, setPhq9Score] = useState<number>(0);
  
  const [gad7CurrentQuestion, setGad7CurrentQuestion] = useState(0);
  const [gad7Answers, setGad7Answers] = useState<number[]>(Array(gad7Questions.length).fill(-1));
  const [gad7Complete, setGad7Complete] = useState(false);
  const [gad7Score, setGad7Score] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentQuestion = activeTab === "phq9" ? phq9CurrentQuestion : gad7CurrentQuestion;
  const setCurrentQuestion = activeTab === "phq9" ? setPhq9CurrentQuestion : setGad7CurrentQuestion;
  const answers = activeTab === "phq9" ? phq9Answers : gad7Answers;
  const setAnswers = activeTab === "phq9" ? setPhq9Answers : setGad7Answers;
  const isComplete = activeTab === "phq9" ? phq9Complete : gad7Complete;
  const setIsComplete = activeTab === "phq9" ? setPhq9Complete : setGad7Complete;
  const questions = activeTab === "phq9" ? phq9Questions : gad7Questions;
  const options = activeTab === "phq9" ? phq9Options : gad7Options;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const totalScore = answers.reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit assessment when complete
      setIsSubmitting(true);
      try {
        const score = totalScore;
        
        if (activeTab === "phq9") {
          await assessmentService.submitPHQ9({
            userId: user?.id || "",
            score: score,
          });
          setPhq9Score(score);
          toast({
            title: "Assessment Submitted",
            description: "Your PHQ-9 assessment has been saved.",
          });
        } else {
          await assessmentService.submitGAD7({
            userId: user?.id || "",
            score: score,
          });
          setGad7Score(score);
          toast({
            title: "Assessment Submitted",
            description: "Your GAD-7 assessment has been saved.",
          });
        }
        
        setIsComplete(true);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to submit assessment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getPHQ9Severity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "text-stress-low", bg: "bg-stress-low/20" };
    if (score <= 9) return { level: "Mild", color: "text-stress-low", bg: "bg-stress-low/20" };
    if (score <= 14) return { level: "Moderate", color: "text-stress-medium", bg: "bg-stress-medium/20" };
    if (score <= 19) return { level: "Moderately Severe", color: "text-stress-high", bg: "bg-stress-high/20" };
    return { level: "Severe", color: "text-stress-high", bg: "bg-stress-high/20" };
  };

  const getGAD7Severity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "text-stress-low", bg: "bg-stress-low/20" };
    if (score <= 9) return { level: "Mild", color: "text-stress-low", bg: "bg-stress-low/20" };
    if (score <= 14) return { level: "Moderate", color: "text-stress-medium", bg: "bg-stress-medium/20" };
    return { level: "Severe", color: "text-stress-high", bg: "bg-stress-high/20" };
  };

  const severity = activeTab === "phq9" ? getPHQ9Severity(totalScore) : getGAD7Severity(totalScore);
  const maxScore = activeTab === "phq9" ? 27 : 21;

  const getResultsText = () => {
    if (activeTab === "phq9") {
      if (totalScore <= 4) {
        return "Your responses suggest minimal symptoms. Continue practicing self-care and check in with yourself regularly.";
      } else if (totalScore <= 9) {
        return "Your responses suggest mild symptoms. Consider exploring our self-help resources or talking to someone you trust.";
      } else if (totalScore <= 14) {
        return "Your responses suggest moderate symptoms. We recommend connecting with a counsellor to discuss support options.";
      }
      return "Your responses suggest significant symptoms. Please consider reaching out to a mental health professional for support.";
    } else {
      if (totalScore <= 4) {
        return "Your responses suggest minimal anxiety. Continue practicing self-care and check in with yourself regularly.";
      } else if (totalScore <= 9) {
        return "Your responses suggest mild anxiety. Consider exploring our self-help resources or relaxation techniques.";
      } else if (totalScore <= 14) {
        return "Your responses suggest moderate anxiety. We recommend connecting with a counsellor to discuss support options.";
      }
      return "Your responses suggest severe anxiety. Please consider reaching out to a mental health professional for support.";
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50 text-center animate-scale-in">
            <div className={`w-20 h-20 rounded-full ${severity.bg} flex items-center justify-center mx-auto mb-6`}>
              {(activeTab === "phq9" && totalScore <= 9) || (activeTab === "gad7" && totalScore <= 9) ? (
                <CheckCircle className={`w-10 h-10 ${severity.color}`} />
              ) : (
                <AlertTriangle className={`w-10 h-10 ${severity.color}`} />
              )}
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">Assessment Complete</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for completing the {activeTab === "phq9" ? "PHQ-9" : "GAD-7"} assessment. Here are your results:
            </p>

            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${severity.bg} mb-8`}>
              <span className="text-lg font-bold text-foreground">{totalScore}</span>
              <span className="text-sm text-muted-foreground">out of {maxScore}</span>
              <span className={`text-sm font-medium ${severity.color}`}>• {severity.level}</span>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-semibold text-foreground mb-3">What this means:</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {getResultsText()}
              </p>
              <p className="text-xs text-muted-foreground">
                Note: This assessment is not a diagnosis. It's a tool to help you understand your feelings better.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="soft"
                className="flex-1"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers(Array(questions.length).fill(-1));
                  setIsComplete(false);
                }}
              >
                Retake Assessment
              </Button>
              {activeTab === "phq9" && !gad7Complete && (
                <Button 
                  variant="calm" 
                  className="flex-1"
                  onClick={() => {
                    setActiveTab("gad7");
                    setGad7CurrentQuestion(0);
                    setGad7Answers(Array(gad7Questions.length).fill(-1));
                    setGad7Complete(false);
                  }}
                >
                  Take GAD-7 Assessment
                </Button>
              )}
              {(activeTab === "gad7" || gad7Complete) && (
                <Button variant="calm" className="flex-1" asChild>
                  <Link to="/resources">View Resources</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-soft">
            <ClipboardList className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground">
            Over the last 2 weeks, how often have you been bothered by the following?
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssessmentType)} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-2xl bg-muted/50 p-1">
            <TabsTrigger 
              value="phq9" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all duration-300"
            >
              PHQ-9 {phq9Complete && "✓"}
            </TabsTrigger>
            <TabsTrigger 
              value="gad7"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft transition-all duration-300"
            >
              GAD-7 {gad7Complete && "✓"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phq9" className="mt-0">
            <div className="text-center mb-6 pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">PHQ-9 Depression Assessment</h2>
              <p className="text-sm text-muted-foreground">
                Patient Health Questionnaire - 9 items
              </p>
            </div>
          </TabsContent>

          <TabsContent value="gad7" className="mt-0">
            <div className="text-center mb-6 pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">GAD-7 Anxiety Assessment</h2>
              <p className="text-sm text-muted-foreground">
                Generalized Anxiety Disorder - 7 items
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{progress.toFixed(0)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-lg font-medium text-foreground mb-8 text-center">
            {questions[currentQuestion]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  answers[currentQuestion] === option.value
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="calm"
            onClick={handleNext}
            disabled={answers[currentQuestion] === -1}
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;
