const { ethers } = require('ethers');

const rpcNodes = [
    '地址',
    '地址',
    '地址',
    '地址'
];

function getRandomRpcNode() {
    const randomIndex = Math.floor(Math.random() * rpcNodes.length);
    return rpcNodes[randomIndex];
}

async function fetchTransferEvents() {
    try {
        const selectedRpcNode = getRandomRpcNode();
        console.log('Selected RPC Node:', selectedRpcNode); // 输出选择的 RPC 节点信息
        const provider = new ethers.providers.JsonRpcProvider(selectedRpcNode);

        provider.on('block', async (blockNumber) => {
            try {
                const block = await provider.getBlock(blockNumber);

                for (const txHash of block.transactions) {
                    try {
                        const tx = await provider.getTransaction(txHash);

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

                await sleep(randomSleep());
            } catch (error) {
                console.error('Error fetching block:', blockNumber, error.message);
            }
        });
    } catch (error) {
        console.error('Error setting up block listener:', error.message);
    }
}

function randomSleep() {
    return Math.floor(Math.random() * 4000) + 1000;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchTransferEvents().catch(error => {
    console.error('Unhandled error:', error.message);
});
