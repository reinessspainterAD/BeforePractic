import contractInstance from "../web3/contractInstance.js";
const web3 = new Web3('http://127.0.0.1:8545');

export async function PromoteNewAdmin(LoggedIn){
    try{
        let promoteDiv = document.getElementById('promoteDiv');
        const divPromote = document.createElement('div')
        divPromote.setAttribute('id', 'PRO');

        const userAddress = document.createElement('select');
        const option = document.createElement('option');
        option.value = ''
        option.textContent = 'Выберете пользователя'
        userAddress.append(option);
        const promote = document.createElement('button');
        promote.innerText = 'Выдвинуть';
        const close = document.createElement('button')
        close.innerText = 'Закрыть';
        
        divPromote.append(userAddress, promote, close);
        promoteDiv.append(divPromote);

        const accounts = await web3.eth.getAccounts();
        for (const acc of accounts) {
            let user = await contractInstance.methods.users(acc).call();
            if (user.isAdmin === false) {
                let option = document.createElement('option');
                option.setAttribute('id', 'AddressOption');
                option.value = user.userAddress;
                option.textContent = user.username;
                userAddress.append(option);
            }
        }

        promote.addEventListener('click', async (e)=>{
            e.preventDefault()
            const userAddressValue = userAddress.value.trim();
            if(userAddressValue == ''){
                console.log("Поле не заполнено")
            }else{
                let response = await contractInstance.methods.promotion(userAddressValue).send({from: LoggedIn, gas: 5000000});
                console.log(response);
            }
        })

        close.addEventListener('click', (e)=>{
            e.preventDefault();
            divPromote.remove(userAddress, promote, close);
        })
    }catch(e){
        console.error(e)
    }

}