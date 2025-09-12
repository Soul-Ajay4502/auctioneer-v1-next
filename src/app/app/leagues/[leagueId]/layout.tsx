import Navbar from '../league-components/navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden">
            <div className="fixed top-0 pt-2 bg-white  z-50 w-full flex justify-center">
                <Navbar />
            </div>
            <div className="mt-16">{children}</div>
        </div>
    )
}
