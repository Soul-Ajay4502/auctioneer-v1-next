export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <div className="w-full flex justify-center items-center bg-[#fff]">{children}</div>
        </div>
    )
}
