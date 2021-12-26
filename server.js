const express = require("express")
const exress =  require("express")
require("./handleapi")
const fs = require("fs")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = exress()
app.use(express.json())

var options = {
    customCss: '.swagger-ui .topbar { display: none } .info__extdocs{display: none}.main{text-align: center}.scheme-container{display: none}'
  };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get("/courses", (req, res)=>{
    fs.readFile("meraki.json", (err, data)=>{
        if (err){
            res.send(err)
        }else{
            res.send(JSON.parse(data))
        }
    })
}) 

app.get("/courses/:id", (req, res)=>{
    console.log(req.params);
    fs.readFile("meraki.json", (err, data)=>{
        data = JSON.parse(data)
        const course = data.filter((i)=>{
            return i.id == req.params.id
        })
        if (course.length>0){
            res.send(data[0])
        }else{
            res.send({'status':'error', 'message':'Course not found..'})
        }
    })
}) 

app.post("/courses", (req, res)=>{
    let bodydata = req.body
    if (Object.keys(bodydata).length<8){
        res.send({'status': 'error', 'example': {
            "name": "Understanding programming through recursion",
            "logo": "http://bit.do/recursion-png",
            "notes": null,
            "days_to_complete": "45",
            "short_description": "Iss course ko hum use kar kar recursions aur programming ki depth mei jayenge.",
            "type": "html",
            "course_type": null,
            "lang_available": ["en"]
          }}) 
    }
    fs.readFile("meraki.json", (err, data)=>{
        console.log(JSON.parse(data));
        data = JSON.parse(data)
        bodydata['id'] = data.length+1
        data.push(bodydata)
        fs.writeFileSync("meraki.json", JSON.stringify(data))
        res.send({'status': 'success', 'inserted':bodydata
    })
    })
})

app.put("/courses/:id", (req, res)=>{
    let bodydata = req.body
    if (Object.keys(bodydata).length<8){
        res.send({'status': 'error', 'example': {
            "name": "Understanding programming through recursion",
            "logo": "http://bit.do/recursion-png",
            "notes": null,
            "days_to_complete": "45",
            "short_description": "Iss course ko hum use kar kar recursions aur programming ki depth mei jayenge.",
            "type": "html",
            "course_type": null,
            "lang_available": ["en"]
          }}) 
    }
    fs.readFile("meraki.json", (err, data)=>{
        console.log(JSON.parse(data));
        data = JSON.parse(data)
        for (var c=0;c<data.length; c++){
            var dict = data[c]
            if (req.params.id == dict.id){
                bodydata['id'] = req.params.id
                data[c] = bodydata
                fs.writeFileSync("meraki.json", JSON.stringify(data))
                res.send({'status': 'success', 'updated': bodydata})
                return ""
            }
        }
        res.send({'status': 'error', 'message':"ID not found"
    })
    })
})

app.delete("/courses/:id", (req, res)=>{
    fs.readFile("meraki.json", (err, data)=>{
        data = JSON.parse(data)
        for (var c=0;c<data.length; c++){
            var dict = data[c]
            if (req.params.id == dict.id){
                data.splice(c,1)
                fs.writeFileSync("meraki.json", JSON.stringify(data))
                res.send({'status': 'success', 'updated': dict})
                return ""
            }
        }
        res.send({'status': 'error', 'message':"ID not found"
    })
    })
})

const PORT = process.env.PORT ||2022;

app.listen(PORT, ()=>{
    console.log(`Your app is listening: http://localhost:${PORT}/courses`);
})