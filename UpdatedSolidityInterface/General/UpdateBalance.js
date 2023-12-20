const web3 = new Web3('http://127.0.0.1:8545');
export async function UpdateBalance(LoggedIn){
    const balance = document.getElementById('Balance');
    setInterval(async ()=>{
        const currentBalance = await web3.eth.getBalance(LoggedIn);
        balance.innerHTML = `Баланс: ${currentBalance/10**18}`;
    }, 500)

}