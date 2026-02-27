export default function ClaimLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0A0F1E] w-full">
            <main className="w-full">
                {children}
            </main>
        </div>
    )
}
