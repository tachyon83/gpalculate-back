const bcrypt = require('bcrypt');
const saltRounds = 10
const username = 'supermanager@pool.com'
const password = 'abcd1234'

class MemberDAO {
    constructor() {
        this.id = username
        bcrypt.genSalt(saltRounds).then(salt => {
            return bcrypt.hash(password, salt)
        }).then(hash => {
            this.pw = hash
            console.log('memberDAO instance is created. hashed pw: ', this.pw)
        }).catch(err => console.error(err.message))
    }
    toJson = () => {
        return {
            id: this.id,
            pw: this.pw,
        }
    }
    match = (id, pw, fn) => {
        console.log('id check: ', id, this.id)
        if (id === this.id) {
            bcrypt.compare(pw, this.pw, (err, res) => {
                if (err) return fn(err, null)
                if (res) return fn(null, this.toJson())
                return fn(null, false)
            })
        }
        else return fn(null, false)
    }
    findById = (id, fn) => {
        if (id === this.id) return fn(null, this.toJson())
        return fn(null, false)
    }
}

module.exports = new MemberDAO();