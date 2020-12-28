var mysql = require('promise-mysql')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

const dbName = 'headsOfStateDB'
const collName = 'headsOfState'
var pool     
var heeadsOfStateDB
var headsOfState

mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'geography',
    insecureAuth: true,
    multipleStatements: true
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    });

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true})
.then((client)=>{
    heeadsOfStateDB = client.db(dbName)
    headsOfState = heeadsOfStateDB.collection(collName)
})
.catch((error)=>{
    console.log(error)
})

var getHeadsOfStates = function(){
    return new Promise((resolve,reject)=>{
        var cursor = headsOfState.find()
        cursor.toArray()
        .then((documents)=>{
            resolve(documents)
        })
        .catch((error)=>{
            reject(error)
        })
    })

}

var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('Select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addCountry = function (code, name, details) {
    return new Promise((resolve, reject) => { 
        pool.query('Insert into country VALUES("' +code +'","' +name +'","' + details+'");')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
var editCountry = function (code, name, details) {
    return new Promise((resolve, reject) => { 
        var queryOne = {
            sql: 'UPDATE country set co_name="'+name +'", co_details="'+details +'" where co_code = ?',
            values: [code]
        }

        pool.query(queryOne)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
var deleteCountry = function (college_id) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [college_id]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('Select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}



var getDetails = function (details) {
    return new Promise((resolve, reject) => {
        var queryOne = {
            sql: 'Select * from city where cty_code = ?',
            values: [details]
        }

        var queryTwo = {
            sql: 'Select * from country where co_code = ?',
            values: [details]
        }

        var store;
        pool.query(queryOne)
            .then((result) => {
                store = result

                queryTwo.values = [result[0].co_code]
                pool.query(queryTwo)
                    .then((result) => {
                        store[0].co_name = result[0].co_name
                        resolve(store)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getCountry = function (country) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'Select * from country where co_code = ?',
            values: [country]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// var getStudent = function (student_id) {
//     return new Promise((resolve, reject) => {
//         var myQuery = {
//             sql: 'Select * from student_table where student_id = ?',
//             values: [student_id]
//         }
//         pool.query(myQuery)
//             .then((result) => {
//                 resolve(result)
//             })
//             .catch((error) => {
//                 reject(error)
//             })
//     })
// }

var deleteCollege = function (college_id) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from college_table where college_id = ?',
            values: [college_id]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
module.exports = { getCountries, getCities, getDetails,getHeadsOfStates,addCountry, getCountry, editCountry, deleteCountry, deleteCollege }