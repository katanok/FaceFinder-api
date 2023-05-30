
const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  console.log('email: ', email, 'name: ', name);
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }
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
          email: loginEmail[0].email,
          name: name,
          joined: new Date(),
        }).then(user => {
          console.log('user[0]: ', user[0]);
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
  handleRegister: handleRegister
}