import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  mode?: "customer" | "admin";
}

export function Chatbot({ mode = "customer" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: mode === "admin" 
        ? "Hello! I'm your CRM assistant. How can I help you today?" 
        : "Hi! I'm here to help you with your car rental. How can I assist you?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue, mode);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const getBotResponse = (input: string, mode: string): string => {
    const lowerInput = input.toLowerCase();

    if (mode === "admin") {
      // Admin-specific responses
      if (lowerInput.includes("booking") || lowerInput.includes("reservation")) {
        return "You can manage bookings from the Bookings tab. Use the calendar to view scheduled rentals, or create new bookings for customers.";
      }
      if (lowerInput.includes("customer")) {
        return "Access customer information in the Customers tab. You can view customer history, contact details, and manage customer segments.";
      }
      if (lowerInput.includes("vehicle") || lowerInput.includes("fleet") || lowerInput.includes("car")) {
        return "Manage your fleet in the Fleet Management section. Add new vehicles, update availability, and track maintenance schedules.";
      }
      if (lowerInput.includes("payment") || lowerInput.includes("invoice")) {
        return "Track payments and invoices in the Invoicing & Payments tab. You can generate invoices, record payments, and view financial reports.";
      }
      if (lowerInput.includes("maintenance")) {
        return "The Maintenance Tracking feature helps you schedule and track vehicle maintenance. Set up alerts for upcoming service dates.";
      }
      if (lowerInput.includes("report") || lowerInput.includes("analytics")) {
        return "View business insights in the Reports & Analytics section. Track revenue, popular vehicles, and booking trends.";
      }
      return "I can help you with bookings, customers, fleet management, payments, maintenance, and reports. What would you like to know more about?";
    } else {
      // Customer-specific responses
      if (lowerInput.includes("book") || lowerInput.includes("rent") || lowerInput.includes("reserve")) {
        return "To book a car, browse our available vehicles, select your preferred car, and follow the booking process. You'll need to provide pickup/return dates and your details.";
      }
      if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("payment")) {
        return "Prices vary by vehicle type and rental duration. You'll see the total cost during the booking process. We accept all major credit cards.";
      }
      if (lowerInput.includes("cancel") || lowerInput.includes("modify") || lowerInput.includes("change")) {
        return "You can manage your bookings from your account dashboard. Log in to view, modify, or cancel your reservations.";
      }
      if (lowerInput.includes("insurance") || lowerInput.includes("coverage")) {
        return "We offer comprehensive insurance options during the booking process. Basic coverage is included, with optional upgrades available.";
      }
      if (lowerInput.includes("location") || lowerInput.includes("pickup") || lowerInput.includes("return")) {
        return "You can select your pickup and return locations during the booking process. We offer convenient locations throughout the area.";
      }
      if (lowerInput.includes("requirement") || lowerInput.includes("license") || lowerInput.includes("age")) {
        return "You'll need a valid driver's license and must be at least 21 years old to rent. Some vehicle categories may have additional requirements.";
      }
      if (lowerInput.includes("help") || lowerInput.includes("support") || lowerInput.includes("contact")) {
        return "You can reach our support team 24/7. Visit the Contact page for phone and email support options.";
      }
      return "I can help you with bookings, pricing, cancellations, insurance, pickup locations, and requirements. What would you like to know?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${
        isMinimized ? "h-14" : "h-[500px]"
      } w-[380px]`}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">
              {mode === "admin" ? "CRM Assistant" : "Customer Support"}
            </h3>
            <p className="text-xs opacity-90">Online now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-700 p-1 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-700 p-1 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
