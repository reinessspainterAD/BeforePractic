import contractInstance from "../web3/contractInstance.js";
import { UpdateBalance } from "./UpdateBalance.js";
import { AddToTransactionList } from "./AddToTransactionList.js";

const web3 = new Web3('http://127.0.0.1:8545');
export async function AcceptTransactions(keyWord, LoggedIn){
    try{
        const transactions = await contractInstance.methods.getTranArray().call();
        console.log(typeof(transactions))
        let tranId;
        outerLoop: 
        for(let i = 0; i < transactions.length; i++){
            let arr = transactions[i];
            for(let j = 0; j < arr.length; j++){
                if((arr.receiver == LoggedIn) && (arr.keyword == keyWord)){
                    tranId = arr.id;
                    break outerLoop;
                }
            }
        }
        if(tranId == ''){
            const response = await contractInstance.methods.acceptTransaction(tranId, keyWord).send({from: LoggedIn});
            console.log(response)
        }else{
            console.error('Id транзакции не найдено!')
        }
        UpdateBalance(LoggedIn);
        AddToTransactionList(LoggedIn)
    }catch(e){
        console.error(e);
    }
}