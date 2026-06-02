"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12">
            Terms of <span className="text-primary">Service.</span>
          </h1>

          <div className="space-y-12 text-gray-400 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using CineVerse, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">2. Account Responsibility</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">3. Premium Content</h2>
              <p>Access to premium content requires a valid subscription or purchase. All sales are final and non-refundable unless specified otherwise by local consumer laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">4. Prohibited Conduct</h2>
              <p>You may not use our platform to distribute illegal content, spam, or perform automated data scraping. We reserve the right to suspend accounts that violate these terms.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
