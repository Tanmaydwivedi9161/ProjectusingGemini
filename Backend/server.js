// Make sure to include these imports:
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
    origin:[process.env.FRONTED_URL],
    credentials:true
}))

app.use(bodyParser.json())
app.use(express.json())

PORT = process.env.PORT || 3000

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "30+5";

app.get('/',(req,res)=>{
     res.send("Hello gemini")
})

const generate = async(prompt)=>{
        try {
            const result = await model.generateContent(prompt);
            // console.log(result.response.text());
            return result.response.text()
        } catch (error) {
            console.log(error)
        }
}


 app.post('/api/content',async(req,res)=>{
    try {
        const data = req.body.question;
        const result = await generate(data);
        return res.send({
            result:result
        })
    } catch (error) {
        res.status(400).json({
            succsess:false,
            message:error.message
        })
    }
 })

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})