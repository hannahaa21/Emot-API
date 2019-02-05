const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const errors = require('./errors.js');
const firebase = require('firebase');
const app = express();
require('firebase/auth');
require('firebase/firestore');
require('firebase/functions');
var firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyA5p7Of8VW0gLlXk6F-YbQB0VrBKRSFEF8",
    authDomain: "leedr-devapp.firebaseapp.com",
    databaseURL: "https://leedr-devapp.firebaseio.com",
    projectId: "leedr-devapp",
    storageBucket: "leedr-devapp.appspot.com",
    messagingSenderId: "631376229434"
});

app.use(compression());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({
    extended: true
}));


///Firebsae/////

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//----------------------------------- USERS ----------------------------------------//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

app.post('/api/newUser', (req, res) => {
    let userObject = req.body;
    if (!userObject.phoneNumber) {
        res.status(401).send({
            error: "Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    if (!userObject.mail) {
        res.status(401).send({
            error: "Email missing",
            message: errors.emailMissingError
        })
    }
    if (!userObject.name) {
        res.status(401).send({
            error: "Name missing",
            message: errors.nameMissingError
        })
    }
    if (!userObject.birthday) {
        res.status(401).send({
            error: "Birthday missing",
            message: errors.birthdayMissingError
        })
    }
    let birthdaySplit = userObject.birthday.split("/"); 
    let birthdayEnd = new Date(birthdaySplit[2], birthdaySplit[1], birthdaySplit[0])
    var entry = {};
    entry.phoneNumber = userObject.phoneNumber;
    entry.mail = userObject.mail;
    entry.name = userObject.name;
    entry.birthday = birthdayEnd;
    entry.chargeMultiplier = 1;
    entry.totalKM = 0;
    entry.weight = 75;
    
            firebase.firestore().collection("users-emot").doc(userObject.phoneNumber).set(entry)
            .then(function () {
                res.status(200).send("Usuario creado")
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        res.status(401).send({
                            message: errors.errorCreatingUser,
                            error:error
                        });
                    });
    
            });
    
});

app.post('/api/updateUser', (req, res) => {
    let userObject = req.body;
    if (!userObject.phoneNumber) {
        res.status(401).send({
            error: "Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    if (!userObject.mail) {
        res.status(401).send({
            error: "Email missing",
            message: errors.emailMissingError
        })
    }
    if (!userObject.name) {
        res.status(401).send({
            error: "Name missing",
            message: errors.nameMissingError
        })
    }
    if (!userObject.birthday) {
        res.status(401).send({
            error: "Birthday missing",
            message: errors.birthdayMissingError
        })
    }
    if (!userObject.weight) {
        res.status(401).send({
            error: "Weight missing",
            message: errors.weightMissingError
        })
    }
    let birthdaySplit = userObject.birthday.split("/"); 
    let birthdayEnd = new Date(birthdaySplit[2], birthdaySplit[1], birthdaySplit[0])
    var entry = {};
    entry.phoneNumber = userObject.phoneNumber;
    entry.mail = userObject.mail;
    entry.name = userObject.name;
    entry.birthday = birthdayEnd;
    entry.weight = userObject.weight;

    var userRef = firebase.firestore().collection("users-emot").doc(userObject.phoneNumber);
    return userRef.update(entry)
        .then(function () {
            res.status(200).send("Usuario Modificado")
                .catch(function (error) {
                    // The document probably doesn't exist.
                    res.status(401).send({
                        message: errors.errorUpdatingUser,
                        error:error
                    });
                });

        });
});

app.post('/api/updateUserMultiplier', (req, res) => {
    let userObject = req.body;
    if (!userObject.phoneNumber) {
        res.status(401).send({
            error: "Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    if (!userObject.chargeMultiplier) {
        res.status(401).send({
            error: "Multiplier missing",
            message: errors.chargeMultiplierMissingError
        })
    }
    var entry = {};
    entry.chargeMultiplier = userObject.chargeMultiplier;

    var userRef = firebase.firestore().collection("users-emot").doc(userObject.phoneNumber);
    return userRef.update(entry)
        .then(function () {
            res.status(200).send("Multiplicador del usuario Modificado")
                .catch(function (error) {
                    // The document probably doesn't exist.
                    res.status(401).send({
                        message: errors.errorUpdatingUser,
                        error:error
                    });
                });

        });
});

app.post('/api/updateUserTotalKM', (req, res) => {
    let userObject = req.body;
    if (!userObject.phoneNumber) {
        res.status(401).send({
            error: "Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    if (!userObject.totalKM) {
        res.status(401).send({
            error: "Total KM missing",
            message: errors.totalKMMissingError
        })
    }
    var entry = {};
    entry.totalKM = userObject.totalKM;

    var userRef = firebase.firestore().collection("users-emot").doc(userObject.phoneNumber);
    return userRef.update(entry)
        .then(function () {
            res.status(200).send("Multiplicador del usuario Modificado")
                .catch(function (error) {
                    // The document probably doesn't exist.
                    res.status(401).send({
                        message: errors.errorUpdatingUser,
                        error:error
                    });
                });

        });
});

app.post('/api/getUserInfo', (req, res) => {
    let userInfo = req.body;
    if (!userInfo.phoneNumber) {
        res.status(401).send({
            error: "User Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    var Entry = firebase.firestore().collection('users-emot').doc(userInfo.phoneNumber);
    Entry.get().then(function (r) {
        var entry = r.data();
        if (entry) {
            var date = new Date(0); 
            date.setUTCSeconds(entry.birthday.seconds);
            res.status(200).send({
                birthday: date,
                chargeMultiplier: entry.chargeMultiplier,
                mail: entry.mail,
                name: entry.name,
                phoneNumber: userInfo.phoneNumber,
                totalKM: entry.totalKM,
                weight: entry.weight,
            });


        } else {
            res.status(401).send({
                error: "User not found",
                message: errors.errorGetUser
            })
        }
    }).catch(function (error) {
        res.status(401).send({
            error:error,
            message: errors.errorGetUser
        })

    });
});

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//----------------------------------- SCOOTERS -------------------------------------//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

app.post('/api/getScooterInfo', (req, res) => {
    let scooterInfo = req.body;
    if (!scooterInfo.id) {
        res.status(401).send({
            error: "Scooter Id missing",
            message: errors.scooterIdMissingError
        })
    }
    var Entry = firebase.firestore().collection('scooters').doc(scooterInfo.id);
    Entry.get().then(function (r) {
        var entry = r.data();
        if (entry) {
            res.status(200).send({
                curent_battery_scooter: entry.curent_battery_scooter,
                current_lat: entry.current_lat,
                current_long: entry.current_long,
                distance_traveled: entry.distance_traveled,
                id: entry.id,
                mac: entry.mac,
                message: entry.message,
                name: entry.name,
            });


        } else {
            res.status(401).send({
                error: "Scooter not found",
                message: errors.errorGetScooter
            })
        }
    });
});

app.get('/api/getAllScootersInfo', (req, res) => {

    firebase.firestore().collection('scooters').get().then(function (querySnapshot) {
        let scooters = [];
        querySnapshot.forEach(function (r) {
            let entry = r.data();
            //console.log(r)
            console.log(entry)
            // doc.data() is never undefined for query doc snapshots
            scooters.push({
                curent_battery_scooter: entry.curent_battery_scooter,
                current_lat: entry.current_lat,
                current_long: entry.current_long,
                id: entry.id,
                mac: entry.mac,
                name: entry.name,
            });
        });
        res.status(200).send(scooters);
    }).catch(function (error) {
        console.log(error);
        res.status(401).send({

            error:error,
            message: errors.errorGetScooters
        })

    });
});



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//----------------------------------- RECEIPTS -------------------------------------//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

app.post('/api/getAllReceiptsInfo', (req, res) => {
    let userInfo = req.body;
    if (!userInfo.phoneNumber) {
        res.status(401).send({
            error: "User phone missing",
            message: errors.phoneNumberMissingError
        })
    }
    console.log(userInfo.phoneNumber);
    firebase.firestore().collection('users-emot').doc(userInfo.phoneNumber).collection('receipts').get().then(function (querySnapshot) {
        let receipts = [];
        querySnapshot.forEach(function (r) {
            let entry = r.data();
            var date = new Date(0); 
            date.setUTCSeconds(entry.date.seconds);
            receipts.push({
                co2: entry.co2,
                date:date,
                finalLatitude: entry.finalLatitude,
                finalLongitude: entry.finalLongitude,
                initialLatitude: entry.initialLatitude,
                initialLatitude: entry.initialLatitude,
                journey:entry.journey,
                scooter: entry.scooter,
                time: entry.time,
                totalPay: entry.totalPay,
            });
        });
        
        if(receipts.length==0){
            res.status(401).send({

                error: "Receipts not found",
                message: errors.errorGetReceipts
            })
        }
        else{
            res.status(200).send(receipts);
        }
        

    }).catch(function (error) {
        console.log(error);
        res.status(401).send({

            error:error,
            message: errors.errorGetReceipts
        })

    });
});

app.post('/api/newReceipt', (req, res) => {
    let receiptInfo = req.body;
    if (!receiptInfo.phoneNumber) {
        res.status(401).send({
            error: "Cellphone missing",
            message: errors.phoneNumberMissingError
        })
    }
    if (!receiptInfo.co2) {
        res.status(401).send({
            error: "CO2 missing",
            message: errors.co2MissingError
        })
    }
    if (!receiptInfo.date) {
        res.status(401).send({
            error: "Date missing",
            message: errors.dateMissingError
        })
    }
    if (!receiptInfo.finalLatitude) {
        res.status(401).send({
            error: "final Latitude missing",
            message: errors.finalLatitudeMissingError
        })
    }
    if (!receiptInfo.finalLongitude) {
        res.status(401).send({
            error: "final Longitude missing",
            message: errors.finalLongitudeMissingError
        })
    }
    if (!receiptInfo.initialLatitude) {
        res.status(401).send({
            error: "initial Latitude missing",
            message: errors.initialLatitudeMissingError
        })
    }
    if (!receiptInfo.initialLongitude) {
        res.status(401).send({
            error: "initial Longitude missing",
            message: errors.initialLongitudeMissingError
        })
    }
    if (!receiptInfo.journey) {
        res.status(401).send({
            error: "Journey data missing",
            message: errors.journeyDataMissingError
        })
    }
    if (!receiptInfo.km) {
        res.status(401).send({
            error: "Kilometers missing",
            message: errors.kmMissingError
        })
    }
    if (!receiptInfo.scooterId) {
        res.status(401).send({
            error: "Scooter Id missing",
            message: errors.scooterIdMissingError
        })
    }
    if (!receiptInfo.totalPay) {
        res.status(401).send({
            error: "Total pay missing",
            message: errors.totalPayMissingError
        })
    }
    if (!receiptInfo.time) {
        res.status(401).send({
            error: "Time of ride missing",
            message: errors.timeReceiptMissingError
        })
    }

    var entry = {};
    entry.phoneNumber = receiptInfo.phoneNumber;
    entry.co2 = receiptInfo.co2;
    entry.date = receiptInfo.date;
    entry.finalLatitude = receiptInfo.finalLatitude;
    entry.finalLongitude = receiptInfo.finalLongitude;
    entry.initialLatitude = receiptInfo.initialLatitude;
    entry.initialLongitude = receiptInfo.initialLongitude;
    entry.journey = receiptInfo.journey;
    entry.km = receiptInfo.km;
    entry.scooterId = receiptInfo.scooterId;
    entry.totalPay = receiptInfo.totalPay;
    entry.time = receiptInfo.time;
    
    firebase.firestore().collection("users-emot").doc(receiptInfo.phoneNumber).collection('receipts').doc().set(entry)
        .then(function () {
            res.status(200).send("Recibo creado")
                .catch(function (error) {
                    // The document probably doesn't exist.
                    res.status(401).send({
                        error:error,
                        message: errors.errorCreatingReceipt
                    });
                });

        });
});

function launch() {
    app.listen({
        host: "localhost",
        port: 4000
    }, () => console.log('Emot Backend listening on port 4000!'))
}
launch();