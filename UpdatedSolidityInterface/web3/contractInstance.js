import abi from "./abi.js";

const web3 = new Web3('http://127.0.0.1:8545');
export const contractAddress = '0xAa443a29A118b4EFEdEF929b610dfE0Dcd96139C';
const contractInstance = new web3.eth.Contract(abi, contractAddress);

export default contractInstance;