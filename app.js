const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("hello world")
})

// configure PORT
PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))