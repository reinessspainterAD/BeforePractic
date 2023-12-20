const web3 = new Web3('http://127.0.0.1:8545');
import { SignIn } from './Singing/SignIn.js';
import { SignUp } from './Singing/SignUp.js';
// import { LoggedIn } from './Singing/SignIn.js';

let LoggedIn;

document.getElementById('SignUpForm').style.display = 'none';

let signInBtn = document.getElementById('SignIn');
signInBtn.addEventListener('click', async (e) =>{
    e.preventDefault();
    await SignIn().then(address =>{
        LoggedIn = address;
    })
});

let signUpBtn = document.getElementById('SignUp')
signUpBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    SignUp();
})

let signOutBtn = document.getElementById('SignOut');
signOutBtn.addEventListener('click', ()=>{
    LoggedIn = '';
    location.reload();
})

