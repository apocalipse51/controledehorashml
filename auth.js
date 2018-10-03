const bcrypt = require('bcryptjs')  
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
   
    //configuraremos o passport aqui
    function findUser(username, callback){     
        console.log(`select * from Indigo_Usuarios where Login = '${username}'`);   
        global.conn
            .query(`select * from Indigo_Usuarios where Login = '${username}'`)
            .then(res => callback(null, res.recordset[0]))                    
            .catch(ex => callback(ex, null));        
    }

    function findUserById(id, callback){
        global.conn
            .query(`select * from Indigo_Usuarios where ID = ${id}`)
            .then(res => callback(null, res.recordset[0]))
            .catch(ex => callback(ex, null));
    }

    passport.serializeUser(function(user, done){
        done(null,user.ID);
    });

    passport.deserializeUser(function(id, done){
        findUserById(id, function(err,user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy( { 
            usernameField: 'username',
            passwordField: 'password'
        },
        (username, password, done) => {
            findUser(username, (err, user) => {
                if (err) { return done(err) }

                // usuário inexistente
                if (!user) { return done(null, false) }

                // comparando as senhas
                console.log("User: ", user);
                console.log("Password: ", password);
                if(password == user.Password) {                        
                    return done(null, user);
                } 
                return done(null, false);
            })
        }
    ));

}