const handleRegister = (req, res, db, bcrypt)=>{
    const {email, password, name} = req.body;
    if(email.length > 0 && password.length > 0){
    const hash = bcrypt.hashSync(password);    
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')    
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))                
            })
        .then(trx.commit)
        .catch(err=> {
            res.json(err)           
            trx.rollback})           
        })
    }else{
        res.status(400).json('bad credentials')
    }
        
}

module.exports = {
    handleRegister: handleRegister
};