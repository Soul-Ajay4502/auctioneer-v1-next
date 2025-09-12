'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useParams, usePathname } from 'next/navigation'
import { useLeagueStore } from '@/store/league-details.store'
import { toast } from 'sonner'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const { leagueId } = useParams()
    const currentPath = usePathname()
    const { leagueData } = useLeagueStore()
    console.log(leagueData)

    const copyLeagueLink = () => {
        if (!leagueData) return
        navigator.clipboard.writeText(leagueData.join_link)
        toast.success('Join link copied to clipboard')
    }

    // Static navigation data - simplified without sub-items
    const navigationItems = [
        {
            label: 'League',
            href: `/app/leagues/${leagueId}`,
            active: currentPath === `/app/leagues/${leagueId}`,
        },
        {
            label: 'Teams',
            href: `/app/leagues/${leagueId}/team-details`,
            active: currentPath.includes(`/app/leagues/${leagueId}/team-details`),
        },
        {
            label: 'Players',
            href: `/app/leagues/${leagueId}/player-details`,
            active: currentPath.includes(`/app/leagues/${leagueId}/player-details`),
        },
        {
            label: 'Auction',
            href: `/app/leagues/${leagueId}/auction`,
            active: currentPath.includes(`/app/leagues/${leagueId}/auction`),
        },
        {
            label: 'League Settings',
            href: `/app/leagues/${leagueId}/settings`,
            active: currentPath.includes(`/app/leagues/${leagueId}/settings`),
        },
    ]

    return (
        <header className=" w-fit bg-white/80 backdrop-blur-md border-b rounded-full border-gray-200/50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group"
                                onMouseEnter={() => setHoveredItem(item.label)}
                                onMouseLeave={() => setHoveredItem(null)}>
                                {/* Background animation */}
                                <div
                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                        item.active
                                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200'
                                            : hoveredItem === item.label
                                              ? 'bg-gray-100 scale-105'
                                              : 'bg-transparent'
                                    }`}></div>

                                {/* Text */}
                                <span
                                    className={`relative z-10 transition-colors duration-300 ${
                                        item.active
                                            ? 'text-blue-600 font-semibold'
                                            : hoveredItem === item.label
                                              ? 'text-gray-900'
                                              : 'text-gray-600 hover:text-gray-900'
                                    }`}>
                                    {item.label}
                                </span>

                                {/* Active indicator */}
                                {item.active && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                )}

                                {/* Hover indicator */}
                                <div
                                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gray-400 rounded-full transition-all duration-300 ${
                                        hoveredItem === item.label && !item.active ? 'w-4 opacity-100' : 'w-0 opacity-0'
                                    }`}></div>
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button with animation */}
                    <div className="hidden md:flex">
                        <Button
                            onClick={copyLeagueLink}
                            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group">
                            <span className="relative z-10">Copy Link</span>
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden relative overflow-hidden hover:bg-gray-100 transition-colors duration-300">
                                <div className="relative w-5 h-5">
                                    <Menu
                                        className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                                    />
                                    <X
                                        className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                                    />
                                </div>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-md">
                            <div className="flex flex-col space-y-6 mt-8">
                                {/* Mobile Logo */}
                                <div className="flex items-center space-x-3 px-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">N</span>
                                    </div>
                                    <span className="font-bold text-lg">NavBar</span>
                                </div>

                                {/* Mobile Navigation */}
                                <div className="space-y-2">
                                    {navigationItems.map((item, index) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:translate-x-2 ${
                                                item.active
                                                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-l-4 border-blue-500'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                            style={{
                                                animationDelay: `${index * 50}ms`,
                                                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none',
                                            }}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile CTA */}
                                <div className="pt-4 px-2">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                                        onClick={() => {
                                            copyLeagueLink()
                                            setIsOpen(false)
                                        }}>
                                        copy Link
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </header>
    )
}
