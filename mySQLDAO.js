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

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        heeadsOfStateDB = client.db(dbName)
        headsOfState = heeadsOfStateDB.collection(collName)
    })
    .catch((error) => {
        console.log(error)
    })

var getHeadsOfStates = function () {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        if (cursor.cursorState.cmd.find != 'headsOfStateDB.headsOfState') {
            reject('Wrong DB/Collection')
        } else {
            cursor.toArray()
                .then((documents) => {
                    resolve(documents)
                })
                .catch((error) => {
                    reject(error)
                })
        }
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
        pool.query('Insert into country VALUES("' + code.toUpperCase() + '","' + name + '","' + details + '");')
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
            sql: 'UPDATE country set co_name="' + name + '", co_details="' + details + '" where co_code = ?',
            values: [code.toUpperCase()]
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

var addHeads = function (code, head) {
    return new Promise((resolve, reject) => {
        var queryOne = {
            sql: 'Select * from country where co_code = ?',
            values: [code.toUpperCase()]
        }

        pool.query(queryOne)
            .then((result) => {
                if (result[0].co_code.toUpperCase() === code.toUpperCase()) {
                    headsOfState.insertOne({ "_id": code.toUpperCase(), "headOfState": head })
                        .then((documents) => {
                            resolve(documents)
                        })
                        .catch((error) => {
                            if (error.code == 11000) {
                                reject('Cannot add Head of State to ' + code.toUpperCase() + ' as this country is is already in the collection')
                            } else {
                                reject(error)
                            }
                        })
                }
            })
            .catch((error) => {
                reject('Cannot add Head of State to ' + code.toUpperCase() + ' as this country is not in MySQL database')
            })
    })
}

module.exports = { getCountries, getCities, getDetails, getHeadsOfStates, addCountry, getCountry, editCountry, deleteCountry, addHeads }