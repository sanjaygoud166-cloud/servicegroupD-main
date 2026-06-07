import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  ShieldCheck,
  FileCheck,
  Building2,
  Bell,
  Cloud,
  Check,
  ArrowRight,
  Lock,
  Award,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Accordion } from '../components/ui/Accordion';

const features = [
  {
    icon: Upload,
    title: 'Document Vault',
    description: 'Store all your business documents securely in one centralized location with enterprise-grade encryption.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification Tracking',
    description: 'Track the status of all your document verifications in real-time with detailed progress updates.',
  },
  {
    icon: Bell,
    title: 'Compliance Monitoring',
    description: 'Never miss important renewals or compliance deadlines with smart notifications and reminders.',
  },
  {
    icon: Building2,
    title: 'Business Profile',
    description: 'Maintain a comprehensive profile with all your company information in one place.',
  },
  {
    icon: FileCheck,
    title: 'Smart Notifications',
    description: 'Receive timely alerts for document expirations, verification updates, and compliance deadlines.',
  },
  {
    icon: Cloud,
    title: 'Secure Cloud Storage',
    description: 'Enterprise-grade document protection with encrypted cloud storage and backup.',
  },
];

const steps = [
  { number: '01', title: 'Create Account', description: 'Sign up and set up your secure business profile' },
  { number: '02', title: 'Add Business Details', description: 'Enter your company information and registration details' },
  { number: '03', title: 'Upload Documents', description: 'Upload all required business documents securely' },
  { number: '04', title: 'Track Verification', description: 'Monitor the status of your document verifications' },
  { number: '05', title: 'Stay Compliant', description: 'Receive reminders and maintain compliance' },
];

const faqItems = [
  {
    title: 'What types of documents can I upload?',
    content: 'You can upload various business documents including PAN Card, Aadhaar Card, GST Certificate, Certificate of Incorporation, Trade License, Utility Bills, Bank Statements, Address Proof, and Tax Documents. We support PDF, JPG, PNG, and DOCX formats.',
  },
  {
    title: 'How secure is my data on BizEase?',
    content: 'BizEase uses enterprise-grade encryption for all documents and data. We employ bank-level security measures including end-to-end encryption, secure cloud storage, and regular security audits to ensure your business information remains protected.',
  },
  {
    title: 'How long does the verification process take?',
    content: 'Document verification typically takes 2-5 business days. The timeline depends on the document type and verification requirements. You can track the progress in real-time from your dashboard.',
  },
  {
    title: 'Can I update or replace uploaded documents?',
    content: 'Yes, you can easily replace or update any uploaded document from your dashboard. Simply navigate to the Documents section, select the document you want to update, and upload the new version.',
  },
  {
    title: 'What happens if a document is about to expire?',
    content: 'BizEase sends automated reminders before document expiry dates. You will receive notifications 30 days, 14 days, and 7 days before expiration, giving you ample time to renew and upload updated documents.',
  },
  {
    title: 'Is BizEase suitable for my business type?',
    content: 'BizEase is designed for all business types including Startups, Small Businesses, MSMEs, Agencies, Freelancers, Private Limited Companies, LLPs, and Sole Proprietorships. Our flexible platform adapts to various business verification needs.',
  },
];

const stats = [
  { value: '50,000+', label: 'Businesses Verified' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '256-bit', label: 'Encryption Standard' },
  { value: '24/7', label: 'Support Available' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">BizEase</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                How It Works
              </a>
              <a href="#faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Enterprise-Grade Security
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight"
            >
              Manage & Verify All Business{' '}
              <span className="text-primary-600">Documents</span> From One Platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Store, organize, track, and verify your business documents securely in one centralized dashboard. Stay compliant and never miss a deadline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Hero Image/Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error-400"></div>
                  <div className="w-3 h-3 rounded-full bg-warning-400"></div>
                  <div className="w-3 h-3 rounded-full bg-success-400"></div>
                </div>
                <div className="text-sm text-slate-400">dashboard.bizease.com</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Documents', value: '24', color: 'bg-slate-100' },
                  { label: 'Verified', value: '18', color: 'bg-success-50' },
                  { label: 'Pending', value: '4', color: 'bg-warning-50' },
                  { label: 'Expired', value: '2', color: 'bg-error-50' },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.color} rounded-xl p-4`}>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything You Need for Business Compliance
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A comprehensive suite of tools designed to simplify your document management and verification process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover padding="lg" className="h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Simple Steps to Get Started
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get your business verification started in minutes with our streamlined process.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <Card padding="md" className="h-full text-center bg-white">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-white font-bold">{step.number}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Trusted by Thousands of Businesses
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Join thousands of businesses who trust BizEase for their document management and verification needs.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Bank-level security with 256-bit encryption',
                  'SOC 2 Type II certified infrastructure',
                  'GDPR compliant data handling',
                  '24/7 monitoring and support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Lock, label: 'Secure Storage', bg: 'bg-primary-100', iconColor: 'text-primary-600' },
                { icon: Award, label: 'Certified', bg: 'bg-success-100', iconColor: 'text-success-600' },
                { icon: Users, label: '50K+ Users', bg: 'bg-secondary-100', iconColor: 'text-secondary-600' },
                { icon: ShieldCheck, label: 'Verified', bg: 'bg-warning-100', iconColor: 'text-warning-600' },
              ].map((item, i) => (
                <Card key={i} padding="lg" className="text-center">
                  <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{item.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Find answers to common questions about BizEase.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card padding="lg">
              <Accordion items={faqItems} />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Simplify Your Business Verification?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of businesses already using BizEase to manage their documents.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary-600 border-white hover:bg-primary-50 gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="ghost" className="text-white hover:bg-primary-700">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BizEase</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-slate-400">
              &copy; 2024 BizEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
