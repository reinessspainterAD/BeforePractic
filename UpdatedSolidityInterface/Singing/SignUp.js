import contractInstance from "../web3/contractInstance.js";
const web3 = new Web3('http://127.0.0.1:8545');

export async function SignUp(){
    try{    
        const signUpWindow = document.getElementById('SignUpForm');
        const signInWindow = document.getElementById('SignInForm');
        signUpWindow.style.display = 'flex';
        signInWindow.style.display = 'none';
        const address = document.getElementById('RegistrationAddresses');
        const fullName = document.getElementById('NewFullName');
        const login = document.getElementById('NewLogin');
        const password = document.getElementById('NewPassword');

        await web3.eth.getAccounts().then(accounts =>{
            accounts.forEach(async acc =>{
                let user = await contractInstance.methods.users(acc).call()
                if(user.username == ''){
                    let option = document.createElement('option'); 
                    option.setAttribute('id','AddressOption');
                    option.value = acc;
                    option.textContent = acc;
                    address.append(option);
                };
            });
        }).catch(error => {
            console.error(`Ошибка: ${error}`);
        })

        let registration = document.getElementById('SignUpForReal');
        registration.addEventListener('click', async (e)=>{
            e.preventDefault();
            const addressValue = address.value;
            const fullNameValue = fullName.value.trim();
            const loginValue = login.value.trim();
            const passwordValue = web3.utils.rightPad(web3.utils.utf8ToHex(password.value.trim()), 64);    
            const error = document.getElementById('RegisterError');
            if(addressValue == '' || fullNameValue  == '' || loginValue  == '' || passwordValue == ''){
                error.innerHTML = 'Поля не заполнены!';
                return;
            }else{
                await contractInstance.methods.addUser(addressValue, fullNameValue, loginValue, passwordValue).send({from: addressValue, gas: 5000000});
                console.log('ok')
                setTimeout(() => {
                    signUpWindow.style.display = 'none';
                    signInWindow.style.display = 'flex';
                }, 5000);
            }
            
        })
    }catch(e){
        console.error(e)
    }
}