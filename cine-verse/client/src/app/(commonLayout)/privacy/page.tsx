"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12">
            Privacy <span className="text-primary">Policy.</span>
          </h1>

          <div className="space-y-12 text-gray-400 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">1. Data Collection</h2>
              <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or communicate with us. This may include your name, email address, and payment information.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">2. AI Data Processing</h2>
              <p>Our platform uses Artificial Intelligence (Google Gemini) to provide personalized recommendations and moderate reviews. This processing is based on your viewing history and interactions within the app to improve your user experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">3. Information Sharing</h2>
              <p>We do not share your personal information with third parties except as required to provide our services (e.g., payment processing via Stripe) or if required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">4. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time through your user dashboard or by contacting our support team.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
