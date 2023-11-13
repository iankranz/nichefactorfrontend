import type { ReactNode } from "react"

function PageLayout({ children }: { children: ReactNode[] }) {
  return (
    <div className="w-full flex flex-col items-center mt-8 gap-2">
      {...children}
    </div>
  )
}

export default PageLayout
