import PageLayout from "./PageLayout"
import { useQuery } from "@tanstack/react-query"
import { Startup } from "./types"
import { Link } from "react-router-dom"

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
      <h1 className="text-3xl">
        Startup
        <br />
        Niche
        <br />
        Factor
      </h1>
      <ul>
        {data.map((startup) => (
          <li key={startup.id}>
            <Link to={`/startup/${startup.id}`}>{startup.name}</Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}

export default IndexPage
