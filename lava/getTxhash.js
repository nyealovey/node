const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('地址');

async function processBlock(blockNumber) {
    try {
        const block = await provider.getBlock(blockNumber);
        console.log('区块:', block.number);

        for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash);
            console.log('交易哈希:', tx.hash);
            console.log('发送者:', tx.from);
            console.log('接收者:', tx.to);
            console.log('转账金额:', ethers.utils.formatEther(tx.value), 'ETH');
            console.log('Gas 价格:', ethers.utils.formatEther(tx.gasPrice), 'ETH');
            console.log('Gas 限制:', tx.gasLimit);
            console.log('交易数据:', tx.data);
        }
    } catch (error) {
        console.error('处理区块时出错:', error.message);
    }
}

async function main() {
    try {
        let currentBlockNumber = await provider.getBlockNumber();

        while (true) {
            await processBlock(currentBlockNumber);
            // 等待一段时间再进行下一次查询，避免频繁查询
            await sleep(5000); // 等待 5 秒

            currentBlockNumber++;
        }
    } catch (error) {
        console.error('主函数出错:', error.message);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);