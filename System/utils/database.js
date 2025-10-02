const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
let db;

const mongoClient = (callback) => {
    MongoClient.connect(
        "mongodb+srv://khantphonenaing156:1234567890@cluster0.ud9do.mongodb.net/POS?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((client)=> {
        console.log('Connected to MongoDB');
        callback()
        db = client.db()
    })
    .catch((err)=> {
        console.log(err)
    })
}

const getDB = () => {
    return db;
}

exports.mongoClient = mongoClient
exports.getDB = getDB