import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const Support = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "How do I place a bulk order?",
      answer: "You can add items to your cart and proceed to checkout. For orders exceeding ₹50,000, specialized bulk pricing is automatically applied at checkout."
    },
    {
      question: "What are the delivery timelines?",
      answer: "We offer express delivery within 24 hours for metro cities and 2-3 days for other locations. You can track your order status in real-time from the 'Orders' page."
    },
    {
      question: "Do you require a drug license for registration?",
      answer: "Yes, as a B2B platform, we require a valid Drug License Number (DLN) or Medical Council Registration number for all pharmacy and clinic accounts."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns for damaged or expired goods within 7 days of delivery. Please initiate a return request from your Order History page."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-txt-dark mb-4">How can we help you?</h1>
        <p className="text-lg text-txt-secondary max-w-2xl mx-auto">
          Our dedicated support team is available 24/7 to assist medical professionals with orders, payments, and account management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="p-8 text-center hover:border-brand-primary transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Phone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-txt-dark mb-2">Call Support</h3>
          <p className="text-txt-secondary mb-4">Mon-Sat, 9am to 7pm</p>
          <a href="tel:+9118001234567" className="text-brand-primary font-bold hover:underline">+91 1800-123-4567</a>
        </Card>

        <Card className="p-8 text-center hover:border-brand-primary transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-colors">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-txt-dark mb-2">Email Us</h3>
          <p className="text-txt-secondary mb-4">We usually reply within 2 hours</p>
          <a href="mailto:support@o2clinic.com" className="text-brand-secondary font-bold hover:underline">support@o2clinic.com</a>
        </Card>

        <Card className="p-8 text-center hover:border-brand-accent transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-txt-dark mb-2">Live Chat</h3>
          <p className="text-txt-secondary mb-4">Chat with our pharma experts</p>
          <button className="text-brand-accent font-bold hover:underline">Start Chat</button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div id="contact" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-txt-dark mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Dr. Ashish" />
              <Input label="Last Name" placeholder="Maurya" />
            </div>
            <Input label="Email Address" type="email" placeholder="doctor@clinic.com" />
            <Input label="Subject" placeholder="Order Inquiry" />
            <div className="space-y-2">
              <label className="text-sm font-bold text-txt-dark">Message</label>
              <textarea
                className="w-full min-h-[150px] p-4 rounded-xl border border-surface-border bg-surface-light focus:bg-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <Button className="w-full h-12 text-lg font-bold">Send Message</Button>
          </form>
        </div>

        {/* FAQs */}
        <div id="faq" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-txt-dark mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden ${openFaq === idx ? 'border-brand-primary bg-brand-primary/5' : 'border-surface-border bg-white hover:border-brand-primary/30'
                  }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-bold ${openFaq === idx ? 'text-brand-primary' : 'text-txt-dark'}`}>{faq.question}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-brand-primary" /> : <ChevronDown className="w-5 h-5 text-txt-placeholder" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-txt-secondary leading-relaxed border-t border-brand-primary/10 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
