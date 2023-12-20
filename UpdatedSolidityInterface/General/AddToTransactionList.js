import contractInstance from "../web3/contractInstance.js";
import { AcceptTransactions } from "./AcceptTransaction.js";
import { CancelTransactions } from "./CancelTransaction.js";
const web3 = new Web3('http://127.0.0.1:8545');
export async function AddToTransactionList(LoggedIn){
    try{    
        let transactions = await contractInstance.methods.getTranArray().call({ from: LoggedIn });
        console.log(transactions)
        const listContainer = document.getElementById('RightDiv');
        listContainer.innerHTML = '';

        const filteredTransactions = transactions.filter((transaction) =>{
            return(transaction.sender === LoggedIn || transaction.receiver === LoggedIn);
        })

        filteredTransactions.forEach(async (transaction) =>{
            let sender = await contractInstance.methods.users(transaction.sender).call({from: LoggedIn})
            let receiver = await contractInstance.methods.users(transaction.receiver).call({from: LoggedIn})
            const transactionDiv = document.createElement('div');
            transactionDiv.innerHTML =`
                <label>Отправитель: ${sender.username}</label>
                <label>Получатель: ${receiver.username}</label>
                <label>Категория: ${transaction.category}</label>
                <label>Описание: ${transaction.description}</label>
                <label>Статус: ${transaction.isConfirmed ? 'Завершено' : 'Ожидание'}</label>
                <label>Сумма: ${web3.utils.fromWei(transaction.amount.toString(), "ether")} ETH</label>
            `
            if(!transaction.isConfirmed){
                if(!transaction.isCancelled){
                    const keyWord = document.createElement('input');
                    keyWord.placeholder = "Кодовое слово";

                    const divForInBtn = document.createElement('div');
                    

                    if(transaction.receiver == LoggedIn){
                        const acceptButton = document.createElement('button');
                        acceptButton.innerHTML = "Принять";
                        divForInBtn.append(keyWord, acceptButton);
                        acceptButton.addEventListener('click', () => {
                            AcceptTransactions(web3.utils.rightPad(web3.utils.utf8ToHex(keyWord.value.trim()), 64), LoggedIn)
                            divForInBtn.style.display = "none";
                        });
                    }else if(transaction.sender == LoggedIn){
                        const cancelButton = document.createElement('button');
                        cancelButton.innerHTML = "Отменить"
                        divForInBtn.appendChild(cancelButton);
                        cancelButton.addEventListener("click", () => {
                            CancelTransactions(LoggedIn)
                            divForInBtn.style.display = "none";
                        })
                    }
                    transactionDiv.appendChild(divForInBtn);
                }else{
                    transactionDiv.innerHTML = `
                        <label>Отправитель: ${sender.username}</label>
                        <label>Получатель: ${receiver.username}</label>
                        <label>Категория: ${transaction.category}</label>
                        <label>Описание: ${transaction.description}</label>
                        <label>Статус: ${transaction.isCancelled ? 'Отменена' : null}</label>
                        <label>Сумма: ${web3.utils.fromWei(transaction.amount.toString(), "ether")} ETH</label>
                    `;
                }
            }
            listContainer.append(transactionDiv);
        })
    }catch(e){
        console.error('Произошла ошибка: ', e)
    }
}