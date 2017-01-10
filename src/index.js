'use strict'
const {json, send} = require('micro');
const post = require('micro-post')
const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Authorization": `Bearer ${process.env.API_KEY}`,
    "Content-type": "application/json"
  }
});

module.exports = post(async function (req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const data = await json(req);
  const resources = Object.keys(data);
  const records = resources.map((item) => {
    return instance.post(`/${process.env.TABLE_NAME}`,{
      "fields": {
        timestamp: new Date().toUTCString(),
        resourceName: item,
        desc: data[item].desc,
        "Beginner friendly": data[item].rating["Beginner friendly"],
        "Comprehensive": data[item].rating["Comprehensive"],
        "Encourages practice":data[item].rating["Encourages practice"],
        "Links to additional resources":data[item].rating["Links to additional resources"],
        "Active community":data[item].rating["Active community"],
        "Overall rating":data[item].rating["Overall rating"]
      }
    })
  });
  try {
    const result = await axios.all(records);
    return send(res, 201, {success: "ok"});
  } catch(e) {
    return send(res, 402, {error: e.response.data});
  }
})
