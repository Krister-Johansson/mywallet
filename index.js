const express = require('express')
const moment = require('moment')
const dotenv = require('dotenv')
const async = require('async')

const wallet = require('./lib/wallet')

const app = express()

dotenv.config()

const port = process.env.PORT

app.get('/', (req, res, next) => {
    async.series({
        historical: (callback) => {
            wallet.historical(
                process.env.CURRENCY,
                moment().subtract(7, 'days').format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD'))
                .then((x) => callback(null, x.bpi))
                .catch((err) => callback(err, null))
        },
        currentprice: (callback) => {
            wallet.currentprice(process.env.CURRENCY)
                .then((x) => callback(null, x.bpi[process.env.CURRENCY].rate_float))
                .catch((err) => callback(err, null))
        },
        balance: (callback) => {
            wallet.balance(process.env.WALLET)
                .then((x) => callback(null, x))
                .catch((err) => callback(err, null))

        },
    }, (err, done) => {
        if (err) {
            return res.status(500).send(err)
        }

        let diagram = []

        async.each(done.historical, (historical, callback) => {
            diagram.push(parseFloat(historical.toFixed(2)))
            callback()
        }, (err) => {
            if (err) {
                res.status(500).send(err)
            }

            res.json({
                balance: done.balance,
                saldo: parseFloat((done.balance * done.currentprice).toFixed(2)),
                currentprice: parseFloat(done.currentprice.toFixed(2)),
                historical: diagram
            })
        })
    })
})

app.listen(port, () => console.log(`Start on port ${port}!`))