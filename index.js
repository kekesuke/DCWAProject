var express = require('express')
var app = express()
var mySQLDAO = require('./mySQLDAO')
var bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res)=>{
   res.sendFile(__dirname + "/views/index.html")
})

app.get('/listCountries', (req, res)=>{
    mySQLDAO.getCountries()
    .then((result)=>{
        res.render('listCountries', {countries:result})
    })
    .catch((error)=>{
        if(error.errno == 1049){
            res.send('<h1> Error Message<br></br><br></br>  Error: Unknow database please check the database name </h1><br></br> <a href="/">Home</a>');
        }else{
            res.send(error)
        }
    })
})

app.get('/listCities', (req, res)=>{
    mySQLDAO.getCities()
    .then((result)=>{
        res.render('listCities', {cities:result})
    })
    .catch((error)=>{
        if(error.errno == 1049){
            res.send('<h1> Error Message<br></br><br></br>  Error: Unknow database please check the database name </h1><br></br> <a href="/">Home</a>');
        }else{
            res.send(error)
        }
    })
})

app.get('/allDetails/:details', (req, res)=>{
    mySQLDAO.getDetails(req.params.details)
    .then((result)=>{
        if(result.length > 0){
            res.render('allDetails', {details:result})
        }     
    })
    .catch((error)=>{
        res.send(error)
    })
})


app.get('/listHeadsOfState', (req, res)=>{
    mySQLDAO.getHeadsOfStates()
    .then((documents)=>{
        res.render('listHeadsOfState', {heads:documents})
    })
    .catch((error)=>{
        res.send('<h1> Error Message<br></br><br></br>  Error:' +error  +' please check the database name or collections </h1><br></br> <a href="/">Home</a>');
    })
})

app.get('/addHeadOfState', (req, res)=>{
    res.render('addHeads', {sendError:  '', sendErrortwo : ''})
})

app.post('/addHeadOfState', (req, res)=>{
    sendErrortwo = ''
    if(req.body.code  < 3 && req.body.head  < 3){
        res.render('addHeads', {sendError: 'Error: Code must be 3 characters', sendErrortwo: 'Error: Name must be atleast 3 characters'});
    }else if(req.body.code.length < 3){
        res.render('addHeads', {sendError: 'Error: Code must be 3 characters' })
    }else if(req.body.head < 3 ){
        res.render('addHeads', {sendError: 'Error: Name must be atleast 3 characters' })
    } 
    else{
    mySQLDAO.addHeads(req.body.code, req.body.head)
    .then(()=>{
        res.redirect('/listHeadsOfState')
    })
    .catch((error)=>{
        if(error.errno = 1062){
            res.render('addHeads', {sendError: 'Error: '+error })
        }else{
            res.send(error.message)
        }
        
    })
    }
})

app.get('/addCountry', (req, res)=>{
    res.render('addCountry', {sendError:  '', sendErrortwo : ''})
})

app.post('/addCountry', (req, res)=>{
    sendErrortwo = ''
    if(req.body.code.length  < 3 && req.body.name.length  < 3){
        res.render('addCountry', {sendError: 'Error: Code must be 3 characters', sendErrortwo: 'Error: Name must be atleast 3 characters'});
    }else if(req.body.code.length < 3){
        res.render('addCountry', {sendError: 'Error: Code must be 3 characters' })
    }else if(req.body.name.length < 3 ){
        res.render('addCountry', {sendError: 'Error: Name must be atleast 3 characters' })
    } 
    else{
    mySQLDAO.addCountry(req.body.code, req.body.name, req.body.details)
    .then(()=>{
        res.redirect('/listCountries')
    })
    .catch((error)=>{
        if(error.errno = 1062){
            res.render('addCountry', {sendError: 'Error: ' +req.body.code +' already exists' })
        }else{
            res.send(error.message)
        }
        
    })
    }
})

app.get('/edit/:code', (req, res)=>{
    mySQLDAO.getCountry(req.params.code)
    .then((result)=>{
        if(result.length > 0){
            res.render('edit', {code:result, sendError: ''})
        }else{
            res.send("<h3> No such student with id: " +req.params.student +"</h3>")
        }
        
    })
    .catch((error)=>{
        res.send(error)
    })
})
app.get('/delete/:code', (req, res)=>{
    mySQLDAO.deleteCountry(req.params.code)
    .then(()=>{
        res.send('<h1> Delete was succsesfull <br></br><br></br> '+ req.params.code +' has been deleted.</h1><br></br> <a href="/">Home</a>');
 
        
    })
    .catch((error)=>{
        if(error.errno == 1451){
            res.send('<h1> Error Message<br></br><br></br> '+ req.params.code +' has cities, it cannot be deleted </h1><br></br> <a href="/">Home</a>');
        }else{
            res.send(error)
        }
       
    })
})

app.post('/edit', (req, res)=>{
    if(req.body.co_name.length < 3  || req.body.co_name === null){
        res.render('edit', {sendError: 'Error: Name must be atleast 3 characters', code: [JSON.parse(JSON.stringify(req.body))]});
    } 
    else{
    mySQLDAO.editCountry(req.body.co_code, req.body.co_name, req.body.co_details)
    .then(()=>{
        res.redirect('/listCountries')
    })
    .catch((error)=>{
        if(error.errno = 1062){
            res.render('edit', {sendError: 'Error: ' +req.body.code +' already exists' })
        }else{
            res.send(error.message)
        }
        
    })
    }
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
})