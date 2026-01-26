import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, Loader2, CheckCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { supportService } from "@/lib/api-service";
import { toast } from "sonner";

/**
 * Help & Support Page
 * Design: Mobile-native banking app style with consistent sizing
 * - FAQs with expandable sections
 * - Contact options (chat, phone, email)
 * - Contact form with API integration
 * - Toast feedback for form submission
 */
export default function HelpSupport() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Contact form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      question: "How do I apply for a loan?",
      answer: "You can apply for a loan through the 'Apply for Loan' section in the app. Fill in your details, review the terms, and submit. You'll receive a decision within 24 hours."
    },
    {
      question: "What are the eligibility requirements?",
      answer: "You must be at least 18 years old, have a valid ID, and a stable income. Use our Pre-Eligibility Checker to see if you qualify."
    },
    {
      question: "How can I make a payment?",
      answer: "You can make payments through the 'Pay Now' button on your loan details page. We accept bank transfers and mobile money."
    },
    {
      question: "Can I restructure my loan?",
      answer: "Yes, you can request loan restructuring through the 'Restructuring' option on your loan details page. We offer flexible tenure extensions."
    },
    {
      question: "What is the interest rate?",
      answer: "Interest rates vary based on loan type and your profile. Rates start from 15% per annum. Check your loan details for your specific rate."
    }
  ];

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await supportService.submitContactRequest({
        subject: subject.trim(),
        message: message.trim(),
        phone: phone.trim() || undefined,
      });

      if (response.success) {
        setSubmittedTicketId(response.ticketId);
        toast.success(response.message || "Message sent successfully!");
        // Clear form
        setSubject("");
        setMessage("");
        setPhone("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to submit contact request:", err);
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, message, phone]);

  const handleNewMessage = useCallback(() => {
    setSubmittedTicketId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <button
            onClick={() => setLocation("/profile")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="space-y-5">
          {/* Contact Options */}
          <div className="grid grid-cols-1 gap-4">
            {/* Chat Support - Coming Soon */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left opacity-70 cursor-not-allowed relative">
              <div className="absolute top-3 right-3">
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Live Chat</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>
            </div>

            {/* Phone Support */}
            <a
              href="tel:+260211123456"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:border-primary transition-colors block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-500">+260 211 123 456</p>
                </div>
              </div>
            </a>

            {/* Email Support */}
            <a
              href="mailto:support@goodleaf.com"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:border-primary transition-colors block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-500">support@goodleaf.com</p>
                </div>
              </div>
            </a>
          </div>

          {/* FAQs Section */}
          <div className="mt-8">
            <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-bold text-base text-gray-900 text-left">{faq.question}</p>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                        expandedFAQ === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFAQ === idx && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <p className="text-base text-gray-600 pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-8">
            <h2 className="text-base font-bold text-gray-900 mb-4">Send us a Message</h2>

            {submittedTicketId ? (
              // Success state
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">
                  Your ticket has been created. We'll get back to you shortly.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500">Ticket ID</p>
                  <p className="font-bold text-primary text-lg">{submittedTicketId}</p>
                </div>
                <Button
                  onClick={handleNewMessage}
                  className="w-full h-12 bg-primary hover:bg-[#256339] text-white font-bold text-base rounded-xl"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              // Form state
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Message *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base resize-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">
                    Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+260 XXX XXX XXX"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !subject.trim() || !message.trim()}
                  className="w-full h-12 bg-primary hover:bg-[#256339] disabled:bg-gray-300 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
