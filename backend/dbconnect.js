var mysql = require('mysql');
var session = require('express-session');
var userdata;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'arjun',
    password: 'admin',
    database: 'carpooling'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting:' + err.stack);
        return;
    }
    console.log('connected as id yes' + connection.threadId);
});


exports.createaccount = function (values, password, res, req) {
    sess = req.session;
    var dob = new Date(values.date_picker);
    console.log(dob);
    var data = [values.first_name, values.last_name, values.gender_select, dob, values.email_id, values.occupation, "none", password]
    var success;
    connection.query('INSERT INTO `users`(`name`, `lastname`, `gender`, `dob`, `email`, `occupation`, `profile_pic`, `password_hash`) VALUES (?,?,?,?,?,?,?,?)', data,
        function (err, result) {
            if (err) throw err;
            if (!err) {
                sess.updateprofile = true;
                res.redirect('/login');
                res.end();
                success = true;
            }
        });
    return success
}



exports.uploadprofile = function (path, id, res, sess) {
    var sess = sess;
    connection.query('UPDATE `users` SET  `profile_pic`= ? WHERE id = ?', [path, id],
        function (err, result) {
            if (err) throw err;
            if (!err) {
                res.redirect('/find');
                res.end();
                sess.updateprofile = null;
            } else {
                res.send("some error ocuured");
                res.end();
            }
        });
}


exports.offeraride = function (data, file, req, res) {
    var sess = req.session;
    if (sess.current_user) {
        if(data.drinking==null){
            data.drinking = 0;
        }
        if(data.smoking==null){
            data.smoking =0;
        }
        if(data.music == null){
            data.music = 0;
        }
        var vehicle_picture = file.filename;
        var current_user = sess.current_user;
        var date_travel = new Date(""+data.travel_date);
        var date_return = new Date(""+data.return_date);
        console.log(data.travel_date);
        console.log(data.return_date);
        var values = [data.source, data.destination, date_travel, data.time_travel, data.purpose,date_return, data.time_return, data.vechicle_model, vehicle_picture, data.drinking, data.smoking, data.music, data.gender_select, current_user,data.rider_rate,data.ride_phone];
        console.log(values);
        connection.query('INSERT INTO `rides`(`source`, `destination`, `travel_date`, `travel_time`, `purpose`, `return_date`, `return_time`, `car_name`, `car_photo`, `drinking`, `smoking`, `music`, `passenger`, `rider_id`,`Rate`,`phone`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', values, function (err, result) {
                   if(err) throw err;
                   if(!err){
                       res.redirect('/find');
                   }
        })
    }
}

exports.getuserdetails = function () {
    console.log("exported from user details");
}

module.exports.connection = connection;