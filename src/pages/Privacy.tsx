import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Database, Clock, UserCheck, ShieldCheck, Bell } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-8 md:py-12 px-4">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Calculator
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how Odetorasy Technologies ("we," "us," or "our") collects, uses, 
            and protects your personal information when you use the Odetorasy Tax Suite application 
            ("Service"). This policy complies with the Nigeria Data Protection Act 2023 and regulations 
            issued by the Nigeria Data Protection Commission (NDPC).
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          
          {/* Section 1: Lawful Basis */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  1. Lawful Basis for Processing
                </h2>
                <p className="text-sm text-muted-foreground">Why we process your data</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                Under the Nigeria Data Protection Act 2023, we process your personal data based on the 
                following lawful bases:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Contract Performance</h4>
                  <p className="text-muted-foreground">
                    We process your salary, deduction preferences, and employee data to perform the tax 
                    calculation service you requested. This processing is necessary to fulfill our 
                    contractual obligations to you.
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Consent</h4>
                  <p className="text-muted-foreground">
                    For optional features like marketing communications and analytics, we rely on your 
                    explicit consent, which you can withdraw at any time.
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Legitimate Interest</h4>
                  <p className="text-muted-foreground">
                    We process certain data to improve our Service, prevent fraud, and ensure security, 
                    where our legitimate interests do not override your rights.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Data Minimization */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  2. Data We Collect (Data Minimization)
                </h2>
                <p className="text-sm text-muted-foreground">Only what we need</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                In accordance with NDPC data minimization principles, we collect only the personal 
                information strictly necessary to provide our Service:
              </p>
              
              <h3 className="font-semibold text-foreground">2.1 Account Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Email address</strong> — For account creation, authentication, and communication</li>
                <li><strong>Password</strong> — Stored in encrypted (hashed) form; we cannot see your password</li>
              </ul>
              
              <h3 className="font-semibold text-foreground">2.2 Tax Calculation Data</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Gross salary figures</strong> — Monthly or annual income amounts</li>
                <li><strong>Deduction preferences</strong> — Pension, NHF, life insurance settings</li>
                <li><strong>Annual rent paid</strong> — For rent relief calculations</li>
              </ul>
              
              <h3 className="font-semibold text-foreground">2.3 Payroll Manager Data (Pro Users)</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Employee names</strong> — For payroll report identification</li>
                <li><strong>Employee salary information</strong> — For batch tax calculations</li>
                <li><strong>Deduction configurations</strong> — Per-employee settings</li>
              </ul>
              
              <h3 className="font-semibold text-foreground">2.4 Payment Information</h3>
              <p>
                We use Flutterwave as our payment processor. We do <strong className="text-foreground">not</strong> store 
                your full card details. Flutterwave handles all payment data in accordance with PCI-DSS 
                standards. We only receive transaction confirmation and subscription status.
              </p>
              
              <h3 className="font-semibold text-foreground">2.5 Technical Data</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Device type and browser information</li>
                <li>IP address (anonymized after 30 days)</li>
                <li>Usage patterns and feature interactions</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Data Retention (Six-Month Rule) */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-warning" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  3. Data Retention (The "Six-Month Rule")
                </h2>
                <p className="text-sm text-muted-foreground">How long we keep your data</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                Under the 2025 Guidelines for Appropriate Implementation of Data (GAID) issued by the NDPC, 
                where no specific legal requirement mandates retention, personal data should be deleted or 
                anonymized within six (6) months of achieving its original purpose.
              </p>
              
              <div className="border-l-2 border-primary pl-4 py-2 my-4">
                <p className="font-semibold text-foreground">Our Retention Schedule:</p>
              </div>
              
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-semibold text-foreground">Data Type</th>
                    <th className="text-left py-2 font-semibold text-foreground">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2">One-time calculations (guest users)</td>
                    <td className="py-2">Not stored</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Account information</td>
                    <td className="py-2">Until account deletion + 30 days</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Payroll employee data</td>
                    <td className="py-2">6 months after last access, or until deleted</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Saved calculation settings</td>
                    <td className="py-2">Duration of subscription + 6 months</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Transaction records</td>
                    <td className="py-2">7 years (Nigerian tax law requirement)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Technical logs</td>
                    <td className="py-2">30 days (anonymized thereafter)</td>
                  </tr>
                </tbody>
              </table>
              
              <p className="text-muted-foreground text-xs mt-4 p-3 bg-muted/50 rounded-md">
                <strong className="text-foreground">Exception for Recurring Payroll:</strong> If you use our 
                Payroll Manager for ongoing monthly calculations, employee data is retained for the duration 
                of your active subscription to enable recurring reports.
              </p>
            </div>
          </section>

          {/* Section 4: Data Subject Rights */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-success/10 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4 text-success" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  4. Your Rights (Data Subject Rights)
                </h2>
                <p className="text-sm text-muted-foreground">What you can request</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                Under the Nigeria Data Protection Act 2023, you have the following rights regarding your 
                personal data:
              </p>
              
              <div className="grid gap-3">
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Access</h4>
                  <p className="text-muted-foreground">
                    Request a copy of all personal data we hold about you. We will respond within 30 days.
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Rectification</h4>
                  <p className="text-muted-foreground">
                    Request correction of any inaccurate or incomplete personal data.
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Erasure ("Right to be Forgotten")</h4>
                  <p className="text-muted-foreground">
                    Request complete deletion of your account and all associated data. We will comply within 
                    30 days unless legal obligations require retention (e.g., transaction records).
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Data Portability</h4>
                  <p className="text-muted-foreground">
                    Request your data in a structured, machine-readable format (JSON or CSV).
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Object</h4>
                  <p className="text-muted-foreground">
                    Object to processing based on legitimate interests or for direct marketing purposes.
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-1">Right to Withdraw Consent</h4>
                  <p className="text-muted-foreground">
                    Where we rely on consent, you can withdraw it at any time without affecting prior 
                    processing.
                  </p>
                </div>
              </div>
              
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@odetorasy.com" className="text-primary hover:underline">
                  privacy@odetorasy.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 5: Security Measures */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  5. Security Measures
                </h2>
                <p className="text-sm text-muted-foreground">How we protect your data</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                data against unauthorized access, alteration, disclosure, or destruction:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Encryption in Transit:</strong> All data transmitted 
                  between your device and our servers is encrypted using TLS 1.3
                </li>
                <li>
                  <strong className="text-foreground">Encryption at Rest:</strong> Database contents are 
                  encrypted using AES-256 encryption
                </li>
                <li>
                  <strong className="text-foreground">Secure Cloud Infrastructure:</strong> We use 
                  enterprise-grade cloud infrastructure with SOC 2 Type II certification
                </li>
                <li>
                  <strong className="text-foreground">Access Controls:</strong> Strict role-based access 
                  controls limit employee access to personal data on a need-to-know basis
                </li>
                <li>
                  <strong className="text-foreground">Password Security:</strong> User passwords are hashed 
                  using bcrypt with salt; we cannot retrieve your original password
                </li>
                <li>
                  <strong className="text-foreground">Row-Level Security:</strong> Database policies ensure 
                  users can only access their own data
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Breach Notification */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-destructive" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  6. Data Breach Notification
                </h2>
                <p className="text-sm text-muted-foreground">Our commitment to transparency</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                In the event of a personal data breach that poses a risk to your rights and freedoms, we 
                commit to:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Notify the NDPC</strong> within 72 hours of becoming 
                  aware of the breach
                </li>
                <li>
                  <strong className="text-foreground">Notify affected users</strong> without undue delay via 
                  email and/or in-app notification
                </li>
                <li>
                  <strong className="text-foreground">Provide clear information</strong> about the nature of 
                  the breach, data affected, and recommended protective measures
                </li>
                <li>
                  <strong className="text-foreground">Document the breach</strong> and our response for 
                  regulatory review
                </li>
              </ul>
              
              <p className="text-muted-foreground text-xs mt-4 p-3 bg-muted/50 rounded-md">
                Our breach notification procedure follows the guidelines issued by the Nigeria Data 
                Protection Commission and international best practices.
              </p>
            </div>
          </section>

          {/* Section 7: Contact & DPO */}
          <section className="card-bento">
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <h2 className="text-lg font-serif font-semibold text-foreground">
                7. Contact Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-2">General Privacy Inquiries</h4>
                  <p className="text-muted-foreground">
                    Email:{" "}
                    <a href="mailto:privacy@odetorasy.com" className="text-primary hover:underline">
                      privacy@odetorasy.com
                    </a>
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="font-semibold text-foreground mb-2">Data Protection Officer</h4>
                  <p className="text-muted-foreground">
                    Email:{" "}
                    <a href="mailto:dpo@odetorasy.com" className="text-primary hover:underline">
                      dpo@odetorasy.com
                    </a>
                  </p>
                </div>
              </div>
              
              <p>
                If you believe we have not handled your data appropriately, you have the right to lodge a 
                complaint with the Nigeria Data Protection Commission (NDPC) at{" "}
                <a 
                  href="https://ndpc.gov.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ndpc.gov.ng
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Odetorasy Technologies. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}