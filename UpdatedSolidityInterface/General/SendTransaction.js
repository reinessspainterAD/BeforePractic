import contractInstance from "../web3/contractInstance.js";
import { UpdateBalance } from "./UpdateBalance.js";
import { AddToTransactionList } from "./AddToTransactionList.js";
const web3 = new Web3('http://127.0.0.1:8545');

export async function SendTransaction(LoggedIn){
    try{    
        let transactionDiv = document.getElementById('transactionDiv');
        const divTransaction = document.createElement('div');
        divTransaction.setAttribute('id', 'TRA');

        const receiverAddress = document.createElement('select');
        const firstResOption = document.createElement('option');
        firstResOption.value = '';
        firstResOption.textContent = 'Выберете пользователя';
        receiverAddress.append(firstResOption);

        const amount = document.createElement('input');
        amount.placeholder ='Введите сумму перевода';

        const category = document.createElement('select');
        const firstCatOption = document.createElement('option');
        firstCatOption.value = '';
        firstCatOption.textContent = 'Выберете категорию'
        category.append(firstCatOption);

        const description = document.createElement('input');
        description.placeholder = 'Введите описание';

        const keyWord = document.createElement('input');
        keyWord.placeholder = 'Введите кодовое слово'

        const btnDiv = document.createElement('div');


        const sendButton = document.createElement('button');
        sendButton.setAttribute('id', 'SendTransaction');
        sendButton.innerText = 'Перевести'

        const closeButton = document.createElement('button')
        closeButton.setAttribute('id', 'CloseTransaction');
        closeButton.innerText = 'Закрыть'

        btnDiv.append(sendButton, closeButton)
        divTransaction.append(receiverAddress, amount, category, description, keyWord, btnDiv);
        transactionDiv.append(divTransaction)

        await web3.eth.getAccounts().then(accounts =>{
            accounts.forEach(async acc =>{
                let user = await contractInstance.methods.users(acc).call();
                if(user.username != ''){
                    let option = document.createElement('option');
                    option.setAttribute('id', 'AddressOption');
                    option.value = acc;
                    option.textContent = user.username;
                    receiverAddress.append(option);
                };
            });
        }).catch(error =>{
            console.error(`Ошибка: ${error}`);
        });

        const categoryArr = await contractInstance.methods.getCategoryArray().call()
        for(let i = 0; i< categoryArr.length; i++){
            let arr1 = categoryArr[i]
            let option = document.createElement('option');
            for(let j = 0; j < arr1.length; j++){
                option.setAttribute('id', 'CategoryOption');
                option.value = arr1.title;
                option.textContent = arr1.title;
                category.append(option);
            }
            
        }

        sendButton.addEventListener('click', async ()=>{
            const receiverAddressValue = receiverAddress.value;
            const categoryValue = category.value;
            const descriptionValue = description.value;
            const keyWordValue = web3.utils.rightPad(web3.utils.utf8ToHex(keyWord.value.trim()), 64);
            if(receiverAddressValue, categoryValue, descriptionValue, keyWordValue != ''){
                let response = await contractInstance.methods.addTransaction(receiverAddressValue, categoryValue, descriptionValue, keyWordValue)
                .send({from: LoggedIn, value: web3.utils.toWei(amount.value, 'ether'), gas: 5000000});
                console.log(response);
                receiverAddress.value = '';
                category.value = '';
                description.value = '';
                keyWord.value = '';
                amount.value = '';
                AddToTransactionList(LoggedIn)
                UpdateBalance(LoggedIn);
            }else{
                console.log('Поля не заполнены')
            }

        })

        closeButton.addEventListener('click', (e) =>{
            e.preventDefault();
            divTransaction.remove(receiverAddress, amount, category, description, keyWord, btnDiv)
        })
    }catch(e){
        console.error(e)
    }
}