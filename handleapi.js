const fs = require("fs")
const axios = require("axios")

if (!fs.existsSync("meraki.json")){
    axios.get("https://api.merakilearn.org/courses")
    .then((data)=>{
        fs.writeFileSync('meraki.json', JSON.stringify(data.data))
    })
    .catch((err)=>{
        console.log(err, "error in api...");
        data = [{}]
        fs.writeFileSync('meraki.json', JSON.stringify(data))
    })
}
