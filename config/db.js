const mongoose = require('mongoose')

const ConnectDB = async () => {
    try {
        const db = await mongoose.connect(
            'mongodb+srv://vahid:vahid1382@cluster0.ixslq.mongodb.net/express?retryWrites=true&w=majority'
        )
        console.log(`Data Base Is Connected ${db.connection.name}`)
    } catch (error) {
        console.log(`Data Base Error => ${error}`)
    }
}

module.exports = ConnectDB
