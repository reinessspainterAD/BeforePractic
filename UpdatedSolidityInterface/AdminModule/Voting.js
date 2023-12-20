import contractInstance from "../web3/contractInstance.js";

export async function Voting(LoggedIn){
    try{
        let voteDiv = document.getElementById('voteDiv');
        const divVote = document.createElement('div')
        divVote.setAttribute('id', 'VOT')
        

        const promotionId = document.createElement('input');
        promotionId.placeholder = 'Введите Id'
        const vote = document.createElement('button');
        vote.innerText = 'Добавить';
        const close = document.createElement('button')
        close.innerText = 'Закрыть'

        divVote.append(promotionId, vote, close);
        voteDiv.append(divVote)

        vote.addEventListener('click', async (e)=>{
            e.preventDefault();
            const promotionIdValue = promotionId.value.trim();
            if(promotionIdValue == ''){
                console.log('Поле не заполнено');
                return;
            }else{
                let response = await contractInstance.methods.vote_promotion(promotionIdValue).send({from: LoggedIn, gas: 5000000});
                console.log(response)
            }
        })

    }catch(e){
        console.error(e)
    }
}