'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

import { useAuthStore } from '@/store/auth.store'

export default function ProjectCreation() {
    const fetchMyDetails = useAuthStore((state) => state.fetchMyDetails)

    useEffect(() => {
        async function fetchData() {
            try {
                await fetchMyDetails()
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
            }
        }

        fetchData()
    }, [fetchMyDetails])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    return (
        <div className="flex items-center justify-center min-h-[90dvh] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl  rounded-xl p-6 bg-[url('/assets/bg/chat-bg.png')] bg-center bg-cover bg-no-repeat">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-2 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 bg-white shadow-md">
                    <div className="relative mb-2 border-b border-gray-100 ">
                        hi there
                    </div>


                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                </motion.div>
            </motion.div>
        </div>
    )
}
