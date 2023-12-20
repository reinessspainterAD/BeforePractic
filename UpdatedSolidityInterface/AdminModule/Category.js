import contractInstance, { contractAddress } from "../web3/contractInstance.js";

export async function Category(LoggedIn){
    try{    
        let categoryDiv = document.getElementById('categoryDiv');
        const divCategory = document.createElement('div')
        divCategory.setAttribute('id', 'CAT')
        

        const title = document.createElement('input');
        title.placeholder = 'Введите название категории'
        const addCategory = document.createElement('button');
        addCategory.innerText = 'Добавить';
        const closeBtn = document.createElement('button')
        closeBtn.innerText = 'Закрыть'

        divCategory.append(title, addCategory, closeBtn);
        categoryDiv.append(divCategory)


        addCategory.addEventListener('click', async (e)=>{
            e.preventDefault()
            const titleValue = title.value.trim();
            if(titleValue == ''){
                console.log('Поле не заполнено');
                return
            }else{
                let response = await contractInstance.methods.addCategory(titleValue).send({from: LoggedIn, gas: 5000000});
                console.log(response)
            }
        })

        closeBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            divCategory.remove(title, addCategory, closeBtn);
        })
    }catch(e){
        console.error(e)
    }
}