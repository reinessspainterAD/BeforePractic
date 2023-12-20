import { Category } from '../AdminModule/Category.js';
import { SendTransaction } from '../General/SendTransaction.js';
import { AddToTransactionList } from '../General/AddToTransactionList.js';
import { PromoteNewAdmin } from '../AdminModule/PromoteNewAdmin.js';
import { Voting } from '../AdminModule/Voting.js';

export async function fillPersonalAccount(user, LoggedIn){
    try{    
        let signOut = document.getElementById('SignOut');
        signOut.style.display = 'flex';
        let personalData = document.getElementById('PersonalData');
        personalData.style.display = 'flex'
        let actions = document.getElementById('UserActions');
        let role = user.isAdmin;
        let leftDiv = document.createElement('div');
        leftDiv.setAttribute('id', 'LeftDiv');

        let rightDiv = document.createElement('div');
        rightDiv.setAttribute('id', 'RightDiv')

        // const transactionListLabel = document.createElement('label');
        // transactionListLabel.innerHTML = 'Лист транзакций:'
        // rightDiv.append(transactionListLabel);

        if(role === true){
            document.getElementById('Role').innerHTML = 'Статус: Админ';

            const promoteDiv = document.createElement('div');
            promoteDiv.setAttribute('id', 'promoteDiv');

            const promoteNewAdmin = document.createElement('button');
            promoteNewAdmin.innerText = 'Выдвинуть нового админа';
            promoteNewAdmin.setAttribute('id', 'ActionButton');
            promoteNewAdmin.addEventListener('click', ()=>{
                PromoteNewAdmin(LoggedIn)
            })

            promoteDiv.append(promoteNewAdmin);

            const voteDiv = document.createElement('div');
            voteDiv.setAttribute('id', 'voteDiv');

            const voteAdmin = document.createElement('button');
            voteAdmin.innerText = 'Проголосовать';
            voteAdmin.setAttribute('id', 'ActionButton');
            voteAdmin.addEventListener('click', ()=>{
                Voting(LoggedIn);
            })

            voteDiv.append(voteAdmin)

            const categoryDiv = document.createElement('div')
            categoryDiv.setAttribute('id', 'categoryDiv');

            const addNewCategory = document.createElement('button');
            addNewCategory.innerText = 'Добавить категорию';
            addNewCategory.setAttribute('id', 'ActionButton');
            addNewCategory.addEventListener('click', ()=>{
                Category(LoggedIn);
            })
            categoryDiv.append(addNewCategory);
            
            const transactionDiv = document.createElement('div');
            transactionDiv.setAttribute('id', 'transactionDiv')

            const sendTransaction = document.createElement('button');
            sendTransaction.innerText = 'Отправить транзакцию';
            sendTransaction.setAttribute('id', 'ActionButton');
            sendTransaction.addEventListener('click', ()=>{
                SendTransaction(LoggedIn);
            });
            transactionDiv.append(sendTransaction);

            leftDiv.append(promoteDiv, voteDiv, categoryDiv, transactionDiv)
            actions.append(leftDiv, rightDiv)

            AddToTransactionList(LoggedIn);

        }else{
            document.getElementById('Role').innerHTML = 'Статус: Пользователь';

            const transactionDiv = document.createElement('div');
            transactionDiv.setAttribute('id', 'transactionDiv')

            const sendTransaction = document.createElement('button');
            sendTransaction.innerText = 'Отправить транзакцию';
            sendTransaction.setAttribute('id', 'ActionButton');
            sendTransaction.addEventListener('click', ()=>{
                SendTransaction(LoggedIn);
            });
            transactionDiv.append(sendTransaction)
            leftDiv.append(transactionDiv);
            actions.append(leftDiv, rightDiv)

            AddToTransactionList(LoggedIn);
        }
    }catch(e){
        console.error(e)
    }
}