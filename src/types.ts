export type Startup = {
  id: string
  name: string
  tagline: string
  summary: string
  location: string
  niche_score: number
  website_url: string
  linkedin_url: string
  created_at: string
  fire_score: number
  snooze_score: number
}

export type StartupLocalState = {
  fire: boolean
  snooze: boolean
}
