const connectToMongo=require("./db")
const express=require('express')
var cors = require('cors')
const app=express()
const port=process.env.PORT


connectToMongo().then(()=>{
    console.log("connection successful......")
})
.catch((err)=>{
    console.log("Connection failed...",err)
}
)

//used to accept json data from the body of request
app.use(express.json())
app.use(cors())

app.use('/',require('./Routes/home'))
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/notes',require('./Routes/notes'))


  
app.listen(port, () => {
  console.log(`NoteWorx app listening on port 127.0.0.1:${port}`)
})