import { Constants } from "../constants/const.js"
import Web3 from 'web3'
const web3 = new Web3(Constants.Web3RPC)

const BN = Web3.utils.BN;

const valueOf = (decimals, reserveDecimals, amount) => {
    return amount.mul((new BN('10')).pow(decimals)).div((new BN('10')).pow(reserveDecimals));
}

const RugTreasuryContract = new web3.eth.Contract(Constants.RUGTreasuryABI, Constants.RugTreasuryAddress);
var RugDecimals = 0;

let InitReserve = async () => {
    var ReserveTokens = [];
    let allReserveTokens = false;
    let index = 0;
    while (!allReserveTokens) {
        await RugTreasuryContract.methods.reserveTokens(index).call().then(async (res) => {
            if (await RugTreasuryContract.methods.isReserveToken(res).call((err, isReserve) => isReserve)) {
                let reserveToken = new web3.eth.Contract(Constants.ERC20Abi, res);
                let decimals = new BN(await reserveToken.methods.decimals().call().then(res => res).catch((err) => 0));
                let balanceOf = new BN(await reserveToken.methods.balanceOf(Constants.RugTreasuryAddress).call().then(res => res).catch((err) => 0));
                let reserveValue = valueOf(RugDecimals, decimals, balanceOf);
                ReserveTokens.push({
                    token: res,
                    decimals: decimals,
                    amount: balanceOf,
                    value: reserveValue
                });
            }
        }).catch((err) => {
            console.log(err);
            allReserveTokens = true
        });
        index++;
    }
    return ReserveTokens;
};

let InitLiquidity = async () => {
    var LiquidityTokens = [];
    let allLiquidityTokens = false;
    let index = 0;
    while (!allLiquidityTokens) {
        await RugTreasuryContract.methods.liquidityTokens(index).call().then(async (res) => {
            if (await RugTreasuryContract.methods.isLiquidityToken(res).call((err, isReserve) => isReserve)) {
                let liquidityToken = new web3.eth.Contract(Constants.ERC20Abi, res);
                let decimals = new BN(await liquidityToken.methods.decimals().call().then(res => res).catch((err) => 0));
                let balanceOf = new BN(await liquidityToken.methods.balanceOf(Constants.RugTreasuryAddress).call().then(res => res).catch((err) => 0));
                let reserveValue = valueOf(RugDecimals, decimals, balanceOf);
                LiquidityTokens.push({
                    token: res,
                    decimals: decimals,
                    amount: balanceOf,
                    value: reserveValue
                });
            }
        }).catch((err) => {
            console.log(err);
            allLiquidityTokens = true
        });
        index++;
    }
    return LiquidityTokens;
};

let InitActualReserves = async () =>{
    return await RugTreasuryContract.methods.totalReserves().call().then((res)=>res).catch((err)=>0);
};

var Reserve = {
    Init: async () => {
        RugDecimals = new BN(await new web3.eth.Contract(Constants.ERC20Abi, Constants.RUGAddress).methods.decimals().call().then(res => res).catch((err) => 0));
        return {
            ReserveTokens: await InitReserve(),
            LiquidityTokens: await InitLiquidity(),
            ActualReserves: await InitActualReserves()
        }
    },
};

export { Reserve } 