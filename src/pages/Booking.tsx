import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Video,
  CheckCircle,
  User,
} from "lucide-react";

const counsellors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Academic Stress"],
    rating: 4.9,
    reviews: 124,
    avatar: "SC",
    color: "bg-primary/10 text-primary",
    available: ["Mon", "Wed", "Fri"],
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    title: "Licensed Counsellor",
    specialties: ["Relationships", "Self-Esteem", "Life Transitions"],
    rating: 4.8,
    reviews: 98,
    avatar: "MB",
    color: "bg-accent text-accent-foreground",
    available: ["Tue", "Thu", "Sat"],
  },
  {
    id: 3,
    name: "Dr. Emily Park",
    title: "Mental Health Specialist",
    specialties: ["Trauma", "Grief", "Mindfulness"],
    rating: 4.9,
    reviews: 156,
    avatar: "EP",
    color: "bg-mint text-mint-foreground",
    available: ["Mon", "Tue", "Wed", "Thu"],
  },
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const Booking = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState<typeof counsellors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<"video" | "chat">("video");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      full: date.toISOString().split("T")[0],
    };
  });

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-stress-low/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-stress-low" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Your session with {selectedCounsellor?.name} has been scheduled.
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${selectedCounsellor?.color} flex items-center justify-center font-semibold`}>
                  {selectedCounsellor?.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCounsellor?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCounsellor?.title}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {sessionType === "video" ? <Video className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  <span>{sessionType === "video" ? "Video Call" : "Chat Session"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="soft"
                onClick={() => {
                  setIsConfirmed(false);
                  setSelectedCounsellor(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                Book Another Session
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Session</h1>
          <p className="text-muted-foreground">
            Connect with our professional counsellors for personalized support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counsellor Selection */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose a Counsellor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counsellors.map((counsellor) => (
                <button
                  key={counsellor.id}
                  onClick={() => setSelectedCounsellor(counsellor)}
                  className={`text-left p-5 rounded-2xl transition-all duration-300 ${
                    selectedCounsellor?.id === counsellor.id
                      ? "bg-primary/5 border-2 border-primary shadow-soft"
                      : "bg-card border border-border/50 shadow-card hover:shadow-hover hover:-translate-y-1"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${counsellor.color} flex items-center justify-center text-lg font-semibold`}>
                      {counsellor.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{counsellor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{counsellor.title}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-stress-medium fill-stress-medium" />
                        <span className="text-sm font-medium text-foreground">{counsellor.rating}</span>
                        <span className="text-sm text-muted-foreground">({counsellor.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {counsellor.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            {/* Session Type */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Session Type</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSessionType("video")}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                    sessionType === "video"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button
                  onClick={() => setSessionType("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                    sessionType === "chat"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Chat</span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => (
                  <button
                    key={date.full}
                    onClick={() => setSelectedDate(date.full)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                      selectedDate === date.full
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs">{date.day}</span>
                    <span className="text-lg font-semibold">{date.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Select Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              variant="calm"
              size="lg"
              className="w-full"
              disabled={!selectedCounsellor || !selectedDate || !selectedTime}
              onClick={handleConfirm}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
