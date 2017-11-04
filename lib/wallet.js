const fetch = require('node-fetch')

module.exports = {
    balance: (id) => {
        return new Promise(
            (resolve, reject) => {
                fetch(`https://blockchain.info/sv/balance?active=${id}`)
                    .then((x) => x.json())
                    .then((x) => {
                        const split = x[id].final_balance.toString().split('.')

                        if (split.length == 1) {
                            let addZero = ""

                            for (var counter = split.toString().length; counter < 8; counter++) {
                                addZero = addZero + "0"
                            }
                            
                            return parseFloat("0." + addZero + split[0])
                        } else {
                            return x[id].final_balance
                        }
                    })
                    .then((x) => resolve(x))
                    .catch((x) => reject(x))
            })
    },
    historical: (currency, start, end) => {
        return new Promise(
            (resolve, reject) => {
                fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}&start=${start}&end=${end}`)
                    .then((x) => x.json())
                    .then((x) => resolve(x))
                    .catch((x) => reject(x))
            })
    },
    currentprice: (currency) => {
        return new Promise(
            (resolve, reject) => {
                fetch(`https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`)
                    .then((x) => x.json())
                    .then((x) => resolve(x))
                    .catch((x) => reject(x))
            })
    }
}