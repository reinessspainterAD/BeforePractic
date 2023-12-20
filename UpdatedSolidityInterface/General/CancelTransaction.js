import contractInstance from "../web3/contractInstance.js";
import { UpdateBalance } from "./UpdateBalance.js";
import { AddToTransactionList } from "./AddToTransactionList.js";

export async function CancelTransactions(LoggedIn){
    try{
        const transactions = await contractInstance.methods.getTranArray().call();
        let tranId;
        outerLoop: 
        for(let i = 0; i < transactions.length; i++){
            let arr = transactions[i];
            for(let j = 0; j < arr.length; j++){
                if(arr.sender == LoggedIn){
                    tranId = arr.id;
                    break outerLoop;
                }
            }
        }

        const response = await contractInstance.methods.cancelTransaction(tranId).send({from: LoggedIn});
        console.log(response)

        UpdateBalance(LoggedIn);
        AddToTransactionList(LoggedIn)
    }catch(e){
        console.error(e);
    }
}