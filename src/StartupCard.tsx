import { Link } from "react-router-dom"
import { Startup } from "./types"

function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link to={`/startup/${startup.id}`}>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{startup.name}</div>
          <div className="flex gap-2">
            <div>🔥{startup.fire_score}</div>
            <div>💤{startup.snooze_score}</div>
          </div>
        </div>
        <div>{startup.tagline}</div>
      </div>
    </Link>
  )
}

export default StartupCard
