import PageLayout from "./PageLayout"
import { useQuery } from "@tanstack/react-query"
import { Startup } from "./types"
import StartupCard from "./StartupCard"

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

  if (isPending) {
    return <span>Lodaing...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <PageLayout>
      <ul className="flex flex-col gap-4">
        {data.map((startup) => (
          <li key={startup.id}>
            <StartupCard startup={startup} />
          </li>
        ))}
      </ul>
      <div></div>
    </PageLayout>
  )
}

export default IndexPage
