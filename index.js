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
        res.send(error)
    })
})

app.get('/listCities', (req, res)=>{
    mySQLDAO.getCities()
    .then((result)=>{
        res.render('listCities', {cities:result})
    })
    .catch((error)=>{
        res.send(error)
    })
})
// app.get('/', (req, res)=>{
//     mySQLDAO.getStudents()
//     .then((result)=>{
//         res.render('showStudents', {students:result})
//     })
//     .catch((error)=>{
//         res.send(error)
//     })
// })

app.get('/allDetails/:details', (req, res)=>{
    mySQLDAO.getDetails(req.params.details)
    .then((result)=>{
        if(result.length > 0){
            res.render('allDetails', {details:result})
        }else{
            res.send("<h3> No such student with id: " +req.params.student +"</h3>")
        }
        
    })
    .catch((error)=>{
        res.send(error)
    })
})

// app.get('/students/:student', (req, res)=>{
//     mySQLDAO.getStudent(req.params.student)
//     .then((result)=>{
//         if(result.length > 0){
//             res.render('showStudents', {students:result})
//         }else{
//             res.send("<h3> No such student with id: " +req.params.student +"</h3>")
//         }
        
//     })
//     .catch((error)=>{
//         res.send(error)
//     })
// })

app.get('/listHeadsOfState', (req, res)=>{
    mySQLDAO.getHeadsOfStates()
    .then((documents)=>{
        console.log(documents)
        res.render('listHeadsOfState', {heads:documents})
    })
    .catch((error)=>{
        res.send(error)
    })
})

app.get('/addCountry', (req, res)=>{
    res.render('addCountry', {sendError:  ''});
})

app.post('/addCountry', (req, res)=>{
    if(req.body.code > 3){
        res.render()
    }
    mySQLDAO.addCountry(req.body.code, req.body.name, req.body.details)
    .then((result)=>{
        res.redirect('/listCountries')
    })
    .catch((error)=>{
        if(error.errno = 1062){
            res.render('addCountry', {sendError: 'Error: ' +req.body.code +' already exists' });
        }else{
            console.log(error)
            res.send(error.message)
        }
        
    })
})

app.get('/colleges/:college', (req, res)=>{
    mySQLDAO.deleteCollege(req.params.college)
    .then((result)=>{
        if(result.affectedRows == 0){
            res.send("<h3> College: "+req.params.college +" doesn't exist </h3>")
        }else{
            res.send("<h3> College: " +req.params.college +" deleted")
        }
       
        
    })
    .catch((error)=>{
            if(error.code == "ER_ROW_IS_REFERENCED_2"){
                res.send("<h3> Error: " +error.errno +" cannot delete college with ID: " +req.params.college +" as it has associated courses</h3>")
            }else{
                res.send("<h3> Error: " +error.errno +" " +error.sqlMessage +" </h3>")
            }
           
       
        
    })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})


