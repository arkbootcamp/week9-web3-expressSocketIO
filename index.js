const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const routerNavigation = require("./src")
// =======================================
const socket = require("socket.io")
// =======================================

const app = express()
app.use(cors())

// =======================================
const http = require("https")
const server = http.createServer(app)
const io = socket(server)

io.on("connection", (socket) => {
  console.log("Socket.io Connect !")

  socket.on("globalMessage", (data) => {
    io.emit("chatMessage", data)
  })

  socket.on("privateMessage", (data) => {
    socket.emit("chatMessage", data)
  })

  socket.on("broadcastMessage", (data) => {
    socket.broadcast.emit("chatMessage", data)
  })

  socket.on("welcomeMessage", (data) => {
    // socket.emit("chatMessage", {
    //   username: "BOT",
    //   message: `Welcome Back ${data.username} !`,
    // })
    // GLOBAL
    // socket.broadcast.emit("chatMessage", {
    //   username: "BOT",
    //   message: `${data.username} Joined Chat !`,
    // })
    // SPESIFIK
    socket.join(data.room)
    // socket.broadcast.to(data.room).emit("chatMessage", {
    //   username: "BOT",
    //   message: `${data.username} Joined Chat !`,
    // })
  })
  socket.on("changeRoom", (data) => {
    // console.log(data);
    socket.leave(data.oldRoom)
    socket.join(data.newRoom)
  })

  socket.on("typing", (data) => {
    socket.broadcast.emit("typingMessage", data)
  })

  socket.on("roomMessage", (data) => {
    io.to(data.room).emit("chatMessage", data)
  })
})
// =======================================

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use("/", routerNavigation)
// =======================================
server.listen(3001, () => {
  // =======================================
  console.log("Listening on Port 3001")
})
