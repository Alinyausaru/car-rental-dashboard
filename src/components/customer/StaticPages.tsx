import { Mail, Phone, MapPin, Send, HelpCircle, FileText, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { contactApi } from "../../utils/api";

interface StaticPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl mb-6 text-center">About AutoRent</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Your trusted car rental partner since 2010
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Quality Vehicles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl text-blue-600 mb-2">13+</div>
              <div className="text-gray-600">Years in Business</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2010, AutoRent has been serving customers with quality rental vehicles and exceptional service. We started with just 5 vehicles and a vision to provide affordable, reliable transportation solutions.
            </p>
            <p className="text-gray-700 mb-4">
              Today, we operate a fleet of over 50 vehicles ranging from economy cars to luxury SUVs, serving thousands of satisfied customers annually. Our commitment to customer satisfaction, transparent pricing, and well-maintained vehicles has made us a trusted name in car rentals.
            </p>
            <h3 className="text-2xl mb-3 mt-6">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              To provide safe, reliable, and affordable car rental services that exceed customer expectations, making every journey comfortable and memorable.
            </p>
            <h3 className="text-2xl mb-3 mt-6">Our Values</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Customer satisfaction is our top priority</li>
              <li>• Transparent pricing with no hidden fees</li>
              <li>• Well-maintained, clean vehicles</li>
              <li>• 24/7 customer support</li>
              <li>• Flexible rental options</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => onNavigate("cars")} className="bg-blue-600 text-lg px-8 h-12">
            Browse Our Fleet
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ContactPage({ onNavigate }: StaticPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactApi.send(formData);
      if (response.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl mb-6 text-center">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Get in touch with our team
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Subject</label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                      <SelectItem value="Booking Help">Booking Help</SelectItem>
                      <SelectItem value="Complaint">Complaint</SelectItem>
                      <SelectItem value="Feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div>123 Main Street</div>
                      <div>Harare, Zimbabwe</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <a href="tel:+263771234567" className="hover:text-blue-600">
                      +263 77 123 4567
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href="mailto:info@autorent.com" className="hover:text-blue-600">
                      info@autorent.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">WhatsApp Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Need quick assistance? Chat with us on WhatsApp
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQPage({ onNavigate }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Find answers to common questions
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>What documents do I need to rent a car?</AccordionTrigger>
            <AccordionContent>
              You need a valid driver's license, ID or passport, and proof of address. If you're under 25, additional requirements may apply.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>What is the minimum age to rent a car?</AccordionTrigger>
            <AccordionContent>
              The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is insurance included in the rental price?</AccordionTrigger>
            <AccordionContent>
              Basic insurance is included. Full insurance coverage with zero excess is available for an additional $25/day.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can I modify or cancel my booking?</AccordionTrigger>
            <AccordionContent>
              Yes, you can modify or cancel your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours are subject to a 50% fee.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>What is your fuel policy?</AccordionTrigger>
            <AccordionContent>
              We offer Full-to-Full policy (free) where you return the car with a full tank, or Pre-purchase Fuel option ($60) where we fill it for you.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Are there any mileage limits?</AccordionTrigger>
            <AccordionContent>
              Daily rentals include 200km per day. Weekly and monthly rentals include unlimited mileage.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept cash, credit/debit cards, bank transfers, EcoCash, and OneMoney.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>Can I pick up and drop off at different locations?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer one-way rentals. Additional fees may apply depending on the distance between locations.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-2xl mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our team is here to help</p>
            <Button onClick={() => onNavigate("contact")} className="bg-blue-600">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TermsPage({ onNavigate }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl mb-6">Terms & Conditions</h1>
        <p className="text-gray-600 mb-12">Last updated: December 2024</p>

        <Card>
          <CardContent className="p-8 prose max-w-none">
            <h2>1. Rental Agreement</h2>
            <p>
              By renting a vehicle from AutoRent, you agree to these terms and conditions. The rental agreement begins when you pick up the vehicle and ends when you return it.
            </p>

            <h2>2. Driver Requirements</h2>
            <p>Drivers must:</p>
            <ul>
              <li>Be at least 21 years old</li>
              <li>Hold a valid driver's license for minimum 2 years</li>
              <li>Provide valid identification (passport or national ID)</li>
              <li>Pay the required deposit</li>
            </ul>

            <h2>3. Payment Terms</h2>
            <p>
              Payment is due at the time of vehicle pickup unless otherwise arranged. We accept cash, credit/debit cards, bank transfers, and mobile money. A refundable security deposit is required for all rentals.
            </p>

            <h2>4. Cancellation Policy</h2>
            <p>
              Cancellations made more than 24 hours before pickup receive a full refund. Cancellations within 24 hours are subject to a 50% cancellation fee.
            </p>

            <h2>5. Insurance & Liability</h2>
            <p>
              Basic insurance is included in all rentals. The renter is responsible for the first $500 of any damage. Full coverage insurance is available for an additional fee.
            </p>

            <h2>6. Fuel Policy</h2>
            <p>
              Vehicles are provided with a full tank of fuel and must be returned full. Failure to return with a full tank will result in refueling charges.
            </p>

            <h2>7. Mileage Limits</h2>
            <p>
              Daily rentals include 200km per day. Additional kilometers are charged at $0.50/km. Weekly and monthly rentals include unlimited mileage.
            </p>

            <h2>8. Late Returns</h2>
            <p>
              A grace period of 1 hour is provided. Returns after this period will be charged at an hourly rate. Returns over 4 hours late will be charged for a full extra day.
            </p>

            <h2>9. Prohibited Uses</h2>
            <p>Vehicles may not be used for:</p>
            <ul>
              <li>Racing, rallying, or competitions</li>
              <li>Towing or pushing other vehicles</li>
              <li>Transport of illegal goods</li>
              <li>Driving under the influence of alcohol or drugs</li>
              <li>Off-road driving (unless specified)</li>
            </ul>

            <h2>10. Damage & Accidents</h2>
            <p>
              Any damage or accidents must be reported to AutoRent immediately. Failure to report may result in full liability for damages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PrivacyPage({ onNavigate }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-12">Last updated: December 2024</p>

        <Card>
          <CardContent className="p-8 prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect the following information:</p>
            <ul>
              <li>Personal identification (name, email, phone, date of birth)</li>
              <li>Driver's license and ID/passport information</li>
              <li>Payment information</li>
              <li>Booking and rental history</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process your bookings and payments</li>
              <li>Communicate about your rentals</li>
              <li>Improve our services</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Comply with legal requirements</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. All payment data is encrypted and processed securely.
            </p>

            <h2>4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with:
            </p>
            <ul>
              <li>Payment processors for transaction processing</li>
              <li>Insurance providers when required</li>
              <li>Law enforcement when legally required</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request corrections to your data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies to improve your browsing experience and analyze website traffic. You can disable cookies in your browser settings.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              For privacy-related questions, contact us at privacy@autorent.com or +263 77 123 4567.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
