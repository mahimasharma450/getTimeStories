const https = require('node:https');
const http = require('node:http');

function gettimeStories(callback)
{
    https.get('https://time.com/', (res) => {
        data = ""
        
        res.on('data', (data_) => {
            data+=data_;
        });

        var items =[]

        res.on('end', ()=>{
            var AllItems = data.split('<div class="partial latest-stories" data-module_name="Latest Stories">')[1];
            var itemsRaw = AllItems.split('<li class="latest-stories__item">')
                        
            itemsRaw.splice(0,1)
            itemsRaw.forEach(element => {
                link = 'https://time.com/'+element.split('<a href="')[1].split('/">')[0]
                title = element.split('<h3 class="latest-stories__item-headline">')[1].split('</h3>')[0]
                items.push({title,link})
            });
        //    console.log("calling callback")
            callback(items);
        });

    }).on('error', (e) => {
        console.error(e);
    });

    //console.log("getTimetoriesEnd");
}


http.createServer(function (req, res) {
    
  
    //console.log(req.url.toLowerCase())

    if(req.url.toLowerCase()=="/gettimestories")
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
        gettimeStories((items)=>{
        //    console.log("inside callback")
            console.log(items)    
            res.write(JSON.stringify(items))
            res.end();
        })
    }
    else{
        res.write('This is home. Please go to http://localhost:8080/getTimeStories');
        res.end();
    }
}).listen(8080);