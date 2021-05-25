const Booking = require('../models/booking');
const User = require('../models/user');

exports.postbooking = (req, res, next) => {
   const userEmailID = req.body.userEmailID;
   const travellers = [req.body.traveller1, req.body.traveller2];

    const booking = new Booking({
        
        userEmailID: userEmailID,
        travellersEmailID: travellers
    })
    booking.save()
        .then(result =>{
            console.log('booking added!');
            console.log(booking);
            User.find({userEmailID:booking.userEmailID}).then(user => {
                res.send({bookingID: booking._id,
                    uuid: user[0]._id,
                    userEmailID: booking.userEmailID,
                    travellers: booking.travellersEmailID,
                    dateAdded: booking.dateAdded
                });
            })
            
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getbookingID = (req, res, next) => {

    const bookingID = req.params.id;
    Booking.findById(bookingID).then(booking=> {
            var uuid;
        User.find({userEmailID: booking.userEmailID}).then(user => {
            uuid=user[0]._id;
            res.send({bookingID: booking._id,
                uuid: uuid,
                userEmailID: booking.userEmailID,
                travellers: booking.travellersEmailID,
                dateAdded: booking.dateAdded
            });
        });
        
    })
}
exports.getBookingByAcccountID = (req, res, next) => {
    const accountID = req.params.id;
    User.findById(accountID).then(user => {
        Booking.find({userEmailID: user.userEmailID}).then( booking => {

            res.send(
                booking.map(b =>
                `{ 
                    "uuid": "${accountID}",
                   "bookingID": "${b._id}",
                   "userEmailID": "${b.userEmailID}",
                   "travellers" : "${b.travellersEmailID}",
                   "dateAdded" : "${b.dateAdded}"
                },
                `
                ).join('')
              )
              //res.send(booking1);
        })
    })
}
exports.getBookingByEmail = (req, res,next) => {
    const email = req.params.email;

    Booking.find({ $or:[{userEmailID: email }, { travellersEmailID : email} ]}).then(booking=>{
       
        booking.forEach(b => {
            User.find({userEmailID: b.userEmailID}).then(user => {
                res.send(
                    booking.map(b =>
                    `{ 
                        "uuid": "${user[0]._id}",
                       "bookingID": "${b._id}",
                       "userEmailID": "${b.userEmailID}",
                       "travellers" : "${b.travellersEmailID}",
                       "dateAdded" : "${b.dateAdded}"
                    },
                    `
                    ).join('')
                  )
            })
        })
    })
}