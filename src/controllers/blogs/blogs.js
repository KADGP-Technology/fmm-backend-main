const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {  email_verification_mail, reqInfo, responseMessage, sendSMS } = require('../../helper')

exports.getAllblog = (req, res) => {
    reqInfo(req);
    const response_data = []
    axios.get(`https://www.googleapis.com/blogger/v3/blogs/${process.env.BLOGER_ID}/posts?key=${process.env.BLOG_KEY}`)
            .then(function (response) {
                for(var i = 0; i<response.data.items.length; i++){
                    let obj = {}
                    var api_res = response.data.items[i]
                    if(api_res.content) {
                      const dom = new JSDOM(`${api_res.content}`);
                      let Image = dom.window.document.querySelector("img").src;
                      if(Image){
                      obj["image"] = Image
                      obj["content"] = api_res.content
                    if(api_res.id) obj["blogId"] = api_res.id
                    if(api_res.published) obj["published"] = api_res.published.slice(0,10)
                    if(api_res.title) obj["title"] = api_res.title
                   
                    if(api_res.author.displayName) obj["author_name"] = api_res.author.displayName
                    if(api_res.author.image.url) obj["author_image"] = "https:"+api_res.author.image.url
                    response_data.push(obj)
                } }
              }
    res.send(response_data)
  })
  .catch(function (error) {
    console.log(error);
  })}


exports.getDetails = (req, res) => {
  if(!req.params.id) return res.status(300).send("send blog id");
  axios.get('https://www.googleapis.com/blogger/v3/blogs/'+ process.env.BLOGER_ID +'/posts/'+req.params.id+'?key=' + process.env.BLOG_KEY)
  .then(function (response) {
    // for keep reading
if(response.data.kind){
  let query = response.data.title.split(/\s+/).slice(0, 1).join(" ");
  axios.get('https://www.googleapis.com/blogger/v3/blogs/'+ process.env.BLOGER_ID +'/posts/search?q='+query+'&key=' + process.env.BLOG_KEY)
  .then(function (queryResponse){
    const keepReading = [];
    for(let i = 0; i<queryResponse.data.items.length; i++){
      var api_res = queryResponse.data.items[i]
         obj = {}
         obj["title"] = api_res.title;
         obj["blogId"] = api_res.id;
         keepReading.push(obj)
    }
    res.send({"content" : response.data.content,
    "title" : response.data.title,
    "author_name" : response.data.author.displayName,
    "date" : response.data.published.slice(0,10),
    "keepReadingData" : keepReading
});
  })}
  })
  .catch(function (error) {
    console.log(error);
  });
}