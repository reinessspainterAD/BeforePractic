import contractInstance from '../web3/contractInstance.js';
import { fillPersonalAccount } from './fillPersonalAccount.js'
const web3 = new Web3('http://127.0.0.1:8545');

export async function SignIn(){
    try{    
        const signInWindow = document.getElementById('SignInForm');

        const login = document.getElementById('Login');
        const password = document.getElementById('Password');
        const errorMessage = document.getElementById('SIError');
        
        const loginText = login.value.trim();
        const passwordText = web3.utils.rightPad(web3.utils.utf8ToHex(password.value.trim()), 64);
        
        const userAddressesLength = await contractInstance.methods.getUserAddressesCount().call();
        
        for(let i = 0; i < userAddressesLength; i++){
            const userAddress = await contractInstance.methods.userAddresses(i).call();
            const user = await contractInstance.methods.users(userAddress).call();
            if((loginText == user.login) && (passwordText == user.password)){
                let LoggedIn = userAddress;
                signInWindow.style.display = 'none';
                document.getElementById('UserName').innerHTML = `${user.username}(${user.login})`;
                document.getElementById('Balance').innerHTML = `Баланс: ${await web3.eth.getBalance(userAddress) / 10**18} ETH`;
                fillPersonalAccount(user, LoggedIn);
                console.log('Вход выполнен')
                return LoggedIn;
            }else if((loginText == '') || (passwordText == '')){
                errorMessage.innerHTML = 'Логин или Пароль не заполнены';
            }else{
                errorMessage.innerHTML = 'Логин или Пароль не совпадают'
            }
        }
    }catch(e){
        console.error(e)
    }
}