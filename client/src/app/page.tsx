"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-50 to-blue-50">
      <motion.section
        variants={stagger}
        initial="initial"
        animate="animate"
        className="text-center max-w-4xl space-y-8 mb-16"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookBuddies
          </h1>
          <p className="mt-4 text-xl text-gray-600 font-medium">
            Where Stories Find New Homes
          </p>
        </motion.div>

        <motion.p variants={fadeInUp} className="text-lg text-gray-700">
          Connect with fellow book lovers in your city to share and exchange
          books
        </motion.p>

        <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              Start Your Journey
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700"
            >
              Continue Reading
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      <motion.section variants={stagger} className="w-full max-w-6xl">
        <motion.div variants={fadeInUp}>
          <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "📖",
                title: "Share Your Books",
                description: "List books you want to share with our community",
              },
              {
                icon: "🔍",
                title: "Discover Locally",
                description: "Find books available near you",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-blue-50">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section variants={stagger} className="w-full max-w-6xl mt-16">
        <motion.div variants={fadeInUp}>
          <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Share Books",
                description:
                  "Easily list your books for sharing with the community",
              },
              {
                icon: "🙏",
                title: "Request Books",
                description:
                  "Find and request books you want to read from others",
              },
              {
                icon: "📍",
                title: "Local Discovery",
                description: "Find available books in your neighborhood",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-blue-50">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.footer
        variants={fadeInUp}
        className="mt-16 text-center text-gray-600"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h4>
          <div className="flex justify-center gap-4">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                Join Now
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm">
            Already a member?
            <Link href="/auth" className="text-blue-600 ml-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.footer>
    </main>
  );
};

export default HomePage;
