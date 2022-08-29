const Web3 = require("web3")

// const web3 = new Web3("wss://wss.api.moonbase.moonbeam.network")
// const web3 = new Web3("https://rpc.api.moonbase.moonbeam.network")

// const web3 = new Web3("wss://wss.api.moonbeam.network")
// const web3 = new Web3("https://rpc.api.moonbeam.network")

const web3 = new Web3("ws://127.0.0.1:9944")
// const web3 = new Web3("http://127.0.0.1:9933")

web3.eth
    .subscribe("pendingTransactions", (error, result) => {
        if (error) console.error(error)
    })
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId)
    })
    .on("data", function (log) {
        console.log(log)
    })
