import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceAIAssistantProps {
  companyName?: string;
  mode?: "customer" | "admin";
}

interface ConversationMessage {
  id: string;
  speaker: "customer" | "assistant";
  text: string;
  timestamp: Date;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAIAssistant({ 
  companyName = "Auto Rent",
  mode = "customer" 
}: VoiceAIAssistantProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        console.warn("Speech recognition not supported in this browser");
      }
    }
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!isSpeakerOn || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Automatically start listening after AI finishes speaking
      if (isCallActive && !isMuted) {
        setTimeout(() => startListening(), 500);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (isMuted || !speechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput(transcript);
      handleVoiceInput(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Retry listening if it was just a no-speech error
      if (event.error === 'no-speech' && isCallActive && !isMuted) {
        setTimeout(() => startListening(), 1000);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startCall = () => {
    setIsCallActive(true);
    
    // Add greeting message
    const greetingText = `Thank you for calling ${companyName}! This is your AI assistant. How can I help you with your car rental needs today?`;
    const greeting: ConversationMessage = {
      id: Date.now().toString(),
      speaker: "assistant",
      text: greetingText,
      timestamp: new Date(),
    };
    setConversation([greeting]);
    
    // Speak the greeting
    setTimeout(() => {
      speak(greetingText);
    }, 500);
  };

  const endCall = () => {
    setIsCallActive(false);
    setConversation([]);
    setIsListening(false);
    setIsMuted(false);
    
    // Stop any ongoing speech or recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Stop listening when muted
      stopListening();
    } else {
      // Start listening when unmuted
      if (isCallActive && !isSpeaking) {
        setTimeout(() => startListening(), 300);
      }
    }
  };

  const toggleSpeaker = () => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    
    // Stop current speech if turning off speaker
    if (!newSpeakerState && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (!transcript.trim()) return;

    // Add customer message
    const customerMessage: ConversationMessage = {
      id: Date.now().toString(),
      speaker: "customer",
      text: transcript,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, customerMessage]);

    // Get AI response
    setTimeout(() => {
      const responseText = getAIResponse(transcript);
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        speaker: "assistant",
        text: responseText,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, assistantMessage]);
      
      // Speak the response
      speak(responseText);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    handleVoiceInput(currentInput);
    setCurrentInput("");
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Greetings
    if (lowerInput.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      return "Hello! I'm here to help you with your car rental. What can I assist you with today?";
    }

    // Availability inquiries
    if (lowerInput.includes("available") || lowerInput.includes("availability")) {
      return "I'd be happy to check availability for you. Could you tell me your preferred pickup location and dates?";
    }

    // Pricing information
    if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("rate") || lowerInput.includes("how much")) {
      return "Great question! Our rates vary by vehicle type and rental duration. We have economy cars starting around $35 per day, mid-size from $45, SUVs from $65, and luxury vehicles from $95. Would you like details on a specific vehicle type?";
    }

    // Booking/Reservation
    if (lowerInput.includes("book") || lowerInput.includes("reserve") || lowerInput.includes("rent")) {
      return "Perfect! I can help gather your rental details. Let me get some information. Where would you like to pick up the car, and what are your rental dates?";
    }

    // Requirements
    if (lowerInput.includes("requirement") || lowerInput.includes("need") || lowerInput.includes("license") || lowerInput.includes("age")) {
      return "Good question! You'll need a valid driver's license that you've held for at least one year, and you must be at least 21 years old. For luxury and larger vehicles, the minimum age is 25. Is there anything specific about requirements you'd like to know?";
    }

    // Vehicle information
    if (lowerInput.includes("vehicle") || lowerInput.includes("car") || lowerInput.includes("suv") || lowerInput.includes("sedan")) {
      return "We have a great selection! We offer economy cars for fuel efficiency, mid-size sedans with more space, SUVs for families or groups, and luxury vehicles for special occasions. What type of vehicle interests you?";
    }

    // Insurance
    if (lowerInput.includes("insurance") || lowerInput.includes("coverage") || lowerInput.includes("protection")) {
      return "We offer several insurance options. Basic liability coverage is included in all rentals. We also offer collision damage waiver, theft protection, and personal accident insurance. Would you like more details on any of these?";
    }

    // Pickup and return
    if (lowerInput.includes("pickup") || lowerInput.includes("drop off") || lowerInput.includes("return") || lowerInput.includes("location")) {
      return "We have multiple convenient locations! Our main locations are open Monday through Friday 8 AM to 7 PM, and weekends 9 AM to 5 PM. We also offer after-hours pickup and return with advance arrangement. Which location works best for you?";
    }

    // Modifications
    if (lowerInput.includes("change") || lowerInput.includes("modify") || lowerInput.includes("update")) {
      return "I can help you with that. To modify an existing reservation, I'll need your booking confirmation number. Do you have that handy?";
    }

    // Cancellation policy
    if (lowerInput.includes("cancel") || lowerInput.includes("refund")) {
      return "Our cancellation policy allows free cancellation up to 48 hours before your pickup time. Cancellations within 48 hours may incur a fee. Would you like to cancel a booking?";
    }

    // Fuel policy
    if (lowerInput.includes("fuel") || lowerInput.includes("gas") || lowerInput.includes("petrol")) {
      return "We operate on a full-to-full fuel policy. You'll receive the car with a full tank, and we ask that you return it full as well. If you prefer, we can offer a prepaid fuel option.";
    }

    // Mileage
    if (lowerInput.includes("mileage") || lowerInput.includes("mile") || lowerInput.includes("kilometer")) {
      return "Good news! All our rentals include unlimited mileage, so you can drive as much as you need without extra charges.";
    }

    // Additional equipment
    if (lowerInput.includes("gps") || lowerInput.includes("child seat") || lowerInput.includes("car seat") || lowerInput.includes("baby seat")) {
      return "Yes, we offer additional equipment! GPS navigation is $10 per day, child seats are $8 per day, and we also have ski racks and other accessories. What would you need?";
    }

    // Young driver
    if (lowerInput.includes("young driver") || lowerInput.includes("under 25") || lowerInput.includes("21")) {
      return "Drivers aged 21 to 24 are welcome to rent with us! There's a young driver surcharge of about $25 per day, and some vehicle categories may have restrictions.";
    }

    // Payment
    if (lowerInput.includes("payment") || lowerInput.includes("deposit") || lowerInput.includes("credit card")) {
      return "We accept all major credit cards. Visa, Mastercard, American Express, and Discover. A security deposit is held on your card during the rental and released upon return.";
    }

    // Hours of operation
    if (lowerInput.includes("hours") || lowerInput.includes("open") || lowerInput.includes("close")) {
      return "Our main office hours are Monday through Friday 8 AM to 7 PM, and weekends 9 AM to 5 PM. We offer after-hours pickup and return by appointment.";
    }

    // Extension
    if (lowerInput.includes("extend") || lowerInput.includes("keep longer") || lowerInput.includes("extra day")) {
      return "You can extend your rental! Just give us a call at least 24 hours before your scheduled return time. Extensions are subject to vehicle availability.";
    }

    // Complaint or issue
    if (lowerInput.includes("problem") || lowerInput.includes("issue") || lowerInput.includes("complaint") || lowerInput.includes("unhappy")) {
      return "I'm sorry to hear you're experiencing an issue. Let me connect you with one of our customer service specialists who can help resolve this right away.";
    }

    // Manager or human
    if (lowerInput.includes("manager") || lowerInput.includes("human") || lowerInput.includes("person") || lowerInput.includes("speak to someone")) {
      return "Of course! I can transfer you to one of our rental specialists. They'll be able to provide more detailed assistance. Please hold for just a moment.";
    }

    // Thank you
    if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
      return "You're very welcome! Is there anything else I can help you with today?";
    }

    // Goodbye
    if (lowerInput.includes("bye") || lowerInput.includes("goodbye") || lowerInput.includes("that's all")) {
      return "Thank you for calling Auto Rent! Have a wonderful day, and we look forward to serving you.";
    }

    // Default response
    return "That's a great question! Could you provide a bit more detail so I can give you the most accurate information?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isCallActive) {
    return (
      <button
        onClick={startCall}
        className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Start voice call"
        title="Voice AI Assistant - Click to call"
      >
        <Phone className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl z-50 w-[400px] flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">{companyName} AI Assistant</h3>
              <p className="text-xs opacity-90">
                {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : "Voice Call Active"}
              </p>
            </div>
          </div>
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
            aria-label="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Call controls */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={toggleMute}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isMuted ? "bg-red-500" : "bg-green-700 hover:bg-green-800"
            }`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-sm">{isMuted ? "Muted" : "Mute"}</span>
          </button>
          <button
            onClick={toggleSpeaker}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isSpeakerOn ? "bg-green-700 hover:bg-green-800" : "bg-gray-500"
            }`}
            aria-label={isSpeakerOn ? "Turn off speaker" : "Turn on speaker"}
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-sm">Speaker</span>
          </button>
        </div>

        {!speechSupported && (
          <div className="mt-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">
            Voice recognition not supported. Use text input below.
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversation.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.speaker === "customer" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.speaker === "customer"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {message.speaker === "customer" ? "You" : "AI Assistant"}
              </p>
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.speaker === "customer" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMuted ? "Unmute to speak..." : "Speak or type your message..."}
            disabled={isMuted}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isMuted}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isMuted 
            ? "🔇 Microphone is muted - Click Mute to speak" 
            : isListening 
            ? "🎤 Listening... Speak now" 
            : isSpeaking
            ? "🔊 AI is speaking..."
            : "💡 Speak naturally or type your message"}
        </p>
      </div>
    </div>
  );
}
