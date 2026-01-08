import { Link } from "react-router-dom";
import { ArrowLeft, FileText, AlertTriangle, CreditCard, Shield, Scale, Gavel } from "lucide-react";

export default function Terms() {
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
              <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service ("Terms") carefully before using the Odetorasy Tax Suite 
            application ("Service") operated by Odetorasy Technologies ("we," "us," or "our").
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          
          {/* Section 1: Financial Disclaimer */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  1. Financial Disclaimer
                </h2>
                <p className="text-sm text-muted-foreground">Critical information about our service</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>
                <strong className="text-foreground">Odetorasy Tax Suite is an informational tool only.</strong> We 
                are not a licensed tax advisory service, accounting firm, or financial institution registered 
                with the Federal Inland Revenue Service (FIRS) or any Nigerian regulatory body.
              </p>
              <p>
                All tax calculations provided by this Service are based on our interpretation of the 
                <strong className="text-foreground"> Nigeria Tax Act 2025</strong> (effective January 2026) and 
                related amendments. These calculations are estimates and should not be relied upon as official 
                tax assessments.
              </p>
              <p>
                <strong className="text-foreground">You should always:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Consult a certified tax professional or chartered accountant for official filings</li>
                <li>Verify calculations with your employer's payroll department</li>
                <li>Cross-reference with FIRS guidelines and official tax tables</li>
                <li>Seek professional advice for complex tax situations</li>
              </ul>
              <p className="text-muted-foreground text-xs mt-4 p-3 bg-muted/50 rounded-md">
                We make no representations or warranties about the accuracy, completeness, or suitability of 
                the tax calculations for your specific situation. Tax laws are subject to change and 
                interpretation by Nigerian tax authorities.
              </p>
            </div>
          </section>

          {/* Section 2: Subscription & Billing */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  2. Subscription & Auto-Renewal
                </h2>
                <p className="text-sm text-muted-foreground">Payment terms and conditions</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <h3 className="font-semibold text-foreground">2.1 Subscription Plans</h3>
              <p>
                Odetorasy Tax Suite offers both free and paid subscription plans. Paid plans ("Pro" 
                subscriptions) provide access to advanced features including Income Targeting, Payroll 
                Management, Global Tax Comparison, and other premium tools.
              </p>
              
              <h3 className="font-semibold text-foreground">2.2 Auto-Renewal</h3>
              <p>
                <strong className="text-foreground">Your subscription will automatically renew</strong> at the 
                end of each billing period (monthly or annually) unless you cancel at least 
                <strong className="text-foreground"> 24 hours before</strong> the renewal date. You authorize 
                us to charge your selected payment method for the renewal amount.
              </p>
              
              <h3 className="font-semibold text-foreground">2.3 Price Changes</h3>
              <p>
                We reserve the right to modify subscription prices. Any price changes will be communicated 
                at least 14 days before taking effect and will apply to subsequent billing cycles.
              </p>
              
              <h3 className="font-semibold text-foreground">2.4 Refund Policy</h3>
              <p>
                Subscription fees are non-refundable except where required by applicable Nigerian law. If 
                you believe you were charged in error, please contact us within 7 days of the charge.
              </p>
              
              <h3 className="font-semibold text-foreground">2.5 Cancellation</h3>
              <p>
                You may cancel your subscription at any time through your account settings. Upon 
                cancellation, you will retain access to Pro features until the end of your current billing 
                period.
              </p>
            </div>
          </section>

          {/* Section 3: Acceptable Use */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  3. Acceptable Use Policy
                </h2>
                <p className="text-sm text-muted-foreground">Prohibited activities and conduct</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>By using our Service, you agree <strong className="text-foreground">not to:</strong></p>
              
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Reverse engineer or scrape</strong> our tax calculation 
                  logic, algorithms, formulas, or any proprietary methodology
                </li>
                <li>
                  <strong className="text-foreground">Use automated tools</strong> (bots, scrapers, crawlers) 
                  to access or extract data from our Service
                </li>
                <li>
                  <strong className="text-foreground">Submit fraudulent data</strong> through the Payroll 
                  Manager or any other feature, including fictitious employees, inflated salaries, or false 
                  deduction claims
                </li>
                <li>
                  <strong className="text-foreground">Resell or redistribute</strong> our Service or outputs 
                  without explicit written permission
                </li>
                <li>
                  <strong className="text-foreground">Attempt to circumvent</strong> subscription restrictions 
                  or access Pro features without valid payment
                </li>
                <li>
                  <strong className="text-foreground">Use the Service for money laundering</strong> or any 
                  activity that violates Nigerian anti-money laundering regulations
                </li>
                <li>
                  <strong className="text-foreground">Impersonate</strong> another person, company, or entity
                </li>
              </ul>
              
              <p className="text-muted-foreground text-xs mt-4 p-3 bg-muted/50 rounded-md">
                Violation of these terms may result in immediate termination of your account without refund 
                and may be reported to relevant Nigerian authorities.
              </p>
            </div>
          </section>

          {/* Section 4: Limitation of Liability */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4 text-destructive" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  4. Limitation of Liability
                </h2>
                <p className="text-sm text-muted-foreground">Scope of our responsibility</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <h3 className="font-semibold text-foreground">4.1 No Liability for Tax Outcomes</h3>
              <p>
                <strong className="text-foreground">We are not responsible for any penalties, fines, interest, 
                or adverse tax outcomes</strong> you may face from the Federal Inland Revenue Service (FIRS), 
                State Internal Revenue Service, or any other tax authority arising from:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Data entry errors made by you</li>
                <li>Reliance on calculations without professional verification</li>
                <li>Changes in tax laws after calculations were performed</li>
                <li>Misinterpretation of outputs by you or third parties</li>
                <li>System errors or temporary service unavailability</li>
              </ul>
              
              <h3 className="font-semibold text-foreground">4.2 Maximum Liability</h3>
              <p>
                To the maximum extent permitted by Nigerian law, our total liability for any claim arising 
                from your use of the Service shall not exceed the amount you paid us in subscription fees 
                during the twelve (12) months preceding the claim.
              </p>
              
              <h3 className="font-semibold text-foreground">4.3 Indirect Damages</h3>
              <p>
                We shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including but not limited to loss of profits, data, business opportunities, or 
                goodwill.
              </p>
            </div>
          </section>

          {/* Section 5: Governing Law */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Gavel className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  5. Governing Law & Dispute Resolution
                </h2>
                <p className="text-sm text-muted-foreground">Legal jurisdiction</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <h3 className="font-semibold text-foreground">5.1 Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the 
                <strong className="text-foreground"> laws of the Federal Republic of Nigeria</strong>, without 
                regard to conflict of law principles.
              </p>
              
              <h3 className="font-semibold text-foreground">5.2 Dispute Resolution</h3>
              <p>
                Any dispute arising from these Terms shall first be attempted to be resolved through 
                good-faith negotiation. If negotiation fails, disputes shall be submitted to binding 
                arbitration in Lagos, Nigeria, in accordance with the Arbitration and Mediation Act 2023.
              </p>
              
              <h3 className="font-semibold text-foreground">5.3 Jurisdiction</h3>
              <p>
                For any matters not subject to arbitration, you agree to submit to the exclusive 
                jurisdiction of the courts of Lagos State, Nigeria.
              </p>
            </div>
          </section>

          {/* Section 6: General Terms */}
          <section className="card-bento">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  6. General Terms
                </h2>
                <p className="text-sm text-muted-foreground">Additional provisions</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <h3 className="font-semibold text-foreground">6.1 Modifications</h3>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be 
                communicated via email or in-app notification at least 14 days before taking effect. 
                Continued use of the Service after changes take effect constitutes acceptance.
              </p>
              
              <h3 className="font-semibold text-foreground">6.2 Severability</h3>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions 
                shall remain in full force and effect.
              </p>
              
              <h3 className="font-semibold text-foreground">6.3 Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between 
                you and Odetorasy Technologies regarding use of the Service.
              </p>
              
              <h3 className="font-semibold text-foreground">6.4 Contact</h3>
              <p>
                For questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@odetorasy.com" className="text-primary hover:underline">
                  legal@odetorasy.com
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