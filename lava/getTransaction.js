const { ethers } = require('ethers');

// 连接到以太坊网络的 Provider
const provider = new ethers.providers.JsonRpcProvider('地址');

async function fetchTransferEvents() {
    try {
        // 循环监听新的区块
        provider.on('block', async (blockNumber) => {
            try {
                // 获取最新区块
                const block = await provider.getBlock(blockNumber);

                // 遍历区块中的交易
                for (const txHash of block.transactions) {
                    try {
                        // 获取交易信息
                        const tx = await provider.getTransaction(txHash);

                        // 如果有发送者和接收者，则输出转账信息
                        if (tx.from && tx.to) {
                            const value = ethers.utils.formatUnits(tx.value, 'ether');
                            const timestamp = new Date(block.timestamp * 1000).toLocaleString();

                            console.log('Transaction Hash:', tx.hash);
                            console.log('Block Number:', block.number);
                            console.log('Timestamp:', timestamp);
                            console.log('From:', tx.from);
                            console.log('To:', tx.to);
                            console.log('Value:', value, 'ETH');
                            console.log('-------------------------------------------');
                        }
                    } catch (error) {
                        console.error('Error fetching transaction:', txHash, error.message);
                    }
                }

                // 随机沉睡一段时间
                await sleep(randomSleep());
            } catch (error) {
                console.error('Error fetching block:', blockNumber, error.message);
            }
        });
    } catch (error) {
        console.error('Error setting up block listener:', error.message);
    }
}

// 生成一个随机的沉睡时间（1到5秒之间）
function randomSleep() {
    return Math.floor(Math.random() * 4000) + 1000;
}

// 沉睡函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchTransferEvents().catch(error => {
    console.error('Unhandled error:', error.message);
});