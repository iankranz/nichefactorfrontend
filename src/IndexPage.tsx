import PageLayout from "./PageLayout"
import { useQuery } from "@tanstack/react-query"
import { Startup } from "./types"
import StartupCard from "./StartupCard"
import { useEffect, useState } from "react"

const PAGE_LENGTH = 5

function IndexPage() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.startupnichefactor.com/startups/"
      )
      return response.json() as Promise<Startup[]>
    },
  })

  const [startups, setStartups] = useState<Startup[]>([])
  const [sortBy, setSortBy] = useState<"score" | "date">("score")
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<Startup[][]>([[]])

  useEffect(() => {
    if (!data?.length) return
    const sortedData = [...data]
    if (sortBy === "date") {
      sortedData.sort((a, b) => {
        return new Date(a.created_at) < new Date(b.created_at) ? 1 : -1
      })
    } else {
      sortedData.sort((a, b) => {
        return a.niche_score < b.niche_score ? 1 : -1
      })
    }
    setStartups(sortedData)
  }, [data, sortBy])

  useEffect(() => {
    if (!startups.length) return
    const myPages = []
    for (let i = 0; i < startups.length; i += PAGE_LENGTH) {
      const myPage = startups.slice(i, i + PAGE_LENGTH)
      myPages.push(myPage)
    }
    setPages(myPages)
  }, [startups])

  if (isPending) {
    return <span>Lodaing...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <PageLayout>
      <div>Sort by...</div>
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 flex items-center justify-center rounded-md border border-grey-10 ${
            sortBy === "score" ? "bg-orange-200" : "bg-white cursor-pointer"
          }`}
          onClick={() => setSortBy("score")}
        >
          Popularity
        </button>
        <button
          className={`px-2 py-1 flex items-center justify-center rounded-md border border-grey-10 ${
            sortBy === "date" ? "bg-orange-200" : "bg-white cursor-pointer"
          }`}
          onClick={() => setSortBy("date")}
        >
          Date added
        </button>
      </div>
      <ul className="flex flex-col gap-4">
        {pages[currentPage].map((startup) => (
          <li key={startup.id}>
            <StartupCard startup={startup} />
          </li>
        ))}
      </ul>
      <ul className="flex gap-2 mb-10">
        {pages.map((_, i) => {
          return (
            <li
              className={`h-10 w-10 flex items-center justify-center rounded-md border border-grey-10 ${
                currentPage === i ? "bg-orange-200" : "bg-white cursor-pointer"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </li>
          )
        })}
      </ul>
    </PageLayout>
  )
}

export default IndexPage
