import type { ReactNode } from "react"

function PageLayout({ children }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-col items-center pt-8 w-full h-full bg-yellow-50 min-h-screen">
      <div className="flex flex-col items-center gap-4 w-80">
        <h1 className="text-6xl text-center">Startup Niche Factor</h1>
        <p className="mb-6">A site for rating startups</p>
        {...children}
      </div>
    </div>
  )
}

export default PageLayout
