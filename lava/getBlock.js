const { ethers } = require('ethers');

// 指定你要连接的以太坊网络
const provider = new ethers.providers.JsonRpcProvider('地址');

async function processLatestBlock() {
    try {
        // 获取当前区块号
        const blockNumber = await provider.getBlockNumber();
        console.log('Current block number:', blockNumber);

        // 根据当前区块号获取区块信息
        const block = await provider.getBlock(blockNumber);
        console.log('Block:', block);

        // 遍历交易信息
        for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash);
            console.log('Transaction:', tx);

            // 处理交易中的发送者和接收者地址
            await processAddress(tx.from);
            await processAddress(tx.to);
        }
    } catch (error) {
        console.error('Error in processing latest block:', error.message);
    }
}

async function processAddress(address) {
    try {
        console.log('Address:', address);
        if (ethers.utils.isAddress(address)) {
            // 如果是合法地址
            const code = await provider.getCode(address);
            if (code === '0x') {
                // 如果是普通地址，查询余额
                const balance = await provider.getBalance(address);
                console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);
            } else {
                // 如果是合约地址，查询合约相关信息
                console.log('Contract Code:', code);
            }
        } else {
            console.log('Invalid address format');
        }
    } catch (error) {
        console.error('Error in processing address:', error.message);
    }
}

async function randomSleep() {
    const randomTime = Math.floor(Math.random() * 100 + 1) * 1000; // 生成 1 到 10 秒之间的随机时间（单位为毫秒）
    console.log(`Waiting for ${randomTime / 1000} seconds`);
    await sleep(randomTime);
}

async function main() {
    while (true) {
        await processLatestBlock();
        // 每次查询后等待随机一段时间再继续下一次查询，避免过于频繁的查询
        await randomSleep(); // 使用随机等待时间
    }
}

// 沉睡函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);