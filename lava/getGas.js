const { ethers } = require('ethers');

// 指定你要连接的以太坊网络
const provider = new ethers.providers.JsonRpcProvider('地址');

async function processBlock(blockNumber) {
    try {
        // 根据区块号获取区块信息
        const block = await provider.getBlock(blockNumber);
        console.log('区块高度:', block.number);
        console.log('状态:', block.confirmations > 0 ? '已确认' : '未最终确认');
        console.log('时间戳:', new Date(block.timestamp * 1000).toISOString());
        console.log(`提议时间：在第${block.number}个区块上提议`);
        console.log(`交易数量：该区块中包含${block.transactions.length}笔交易和${block.transactions.filter(tx => !tx.to).length}笔合约内部交易`);
        console.log(`提现：该区块中有${block.transactions.filter(tx => tx.type === '0').length}笔提现交易`);
        console.log('手续费收款方:', block.miner); // 修正此行以输出矿工地址
        console.log('Gas 使用量:', block.gasUsed, `(${((block.gasUsed / block.gasLimit) * 100).toFixed(2)}%)`);
        console.log('Gas 限制:', block.gasLimit);
        console.log(`每 Gas 的基础手续费：${ethers.utils.formatEther(block.baseFeePerGas)} ETH (${block.baseFeePerGas * 1e9} Gwei)`);
    } catch (error) {
        console.error(`Error in processing block ${blockNumber}:`, error.message);
    }
}

async function randomBlockNumber(currentBlockNumber) {
    // 生成一个随机数，范围是[currentBlockNumber - 1, currentBlockNumber]
    return Math.floor(Math.random() * 20) + currentBlockNumber - 19;
}

async function randomSleep() {
    const randomTime = Math.floor(Math.random() * 10 + 1) * 1000; // 生成 1 到 10 秒之间的随机时间（单位为毫秒）
    console.log(`Waiting for ${randomTime / 1000} seconds`);
    await sleep(randomTime);
}

async function main() {
    const currentBlockNumber = await provider.getBlockNumber();
    console.log('当前区块高度:', currentBlockNumber);

    // 获取当前区块的随机前一个区块号
    const randomBlock = await randomBlockNumber(currentBlockNumber);

    // 查询当前区块的随机前一个区块
    await processBlock(randomBlock);

    // 每次查询后等待随机一段时间再继续下一次查询，避免过于频繁的查询
    await randomSleep(); // 使用随机等待时间
}

// 沉睡函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 循环执行主函数
(async function loop() {
    while (true) {
        await main();
    }
})();