const express = require("express")

const postsRouter = require("./posts/posts-router")

const server = express()
server.use(express.json())

server.use("/api/posts", postsRouter)

server.get('/', (req, res) => {
    res.send(` <h2> We Here!!!! </h2>`)
})


// create listen
server.listen(5000, () => {
    console.log('\n*** Server Running on http://localhost:5000 ***\n')
})