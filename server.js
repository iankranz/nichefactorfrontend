import express from "express"
import { resolve, join } from "path"

const app = express()

app.use(express.static("dist/"))

app.get("*", (req, res) => {
  res.sendFile(join(resolve(), "/dist/index.html"))
})

app.listen(3000)
