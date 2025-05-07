'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to Auctioneer
        </h1>
        <p className="text-gray-700 text-lg">
          A modern platform for organizing, managing, and participating in online auctions. Whether you're selling rare collectibles or bidding on your next treasure, Auctioneer makes it seamless and secure.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/sign-in')} variant="default">Get Started</Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          {
            title: "List Auctions Easily",
            description:
              "Create and manage auction listings with our intuitive interface.",
          },
          {
            title: "Live Bidding",
            description:
              "Participate in real-time bidding with instant updates and notifications.",
          },
          {
            title: "Secure Transactions",
            description:
              "Built-in payment and verification systems ensure smooth and safe transactions.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </main>
  )
}
