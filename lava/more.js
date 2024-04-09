const fetch = require('node-fetch');
const ethers = require('ethers');

async function main() {
    const rpcUrls = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
    ];

    // 每次循环生成不同数量的地址并进行查询
    for (let batch = 1; batch <= 5000000; batch++) {
        const numAddresses = Math.floor(Math.random() * 30) + 1; // 在循环内部定义numAddresses
        const rpcUrl = getRandomRpcUrl(rpcUrls);
        console.log(`批次 ${batch}: 查询 ${numAddresses} 个地址的余额，使用RPC: ${rpcUrl}`);
        const addresses = Array.from({ length: numAddresses }, () => ethers.Wallet.createRandom().address);

        try {
            const randomHeaders = generateRandomHeaders(); // 生成随机请求头
            const balances = await Promise.all(addresses.map(address => checkBalance(address, rpcUrl, randomHeaders)));
            balances.forEach((balance, index) => {
                console.log(`地址: ${addresses[index]} 的余额为: ${balance} ETH`);
            });
        } catch (error) {
            console.error(`查询余额时出错: ${error.message}`);
        }

        const sleepSeconds = Math.floor(Math.random() * 40) + 1;
        console.log(`等待 ${sleepSeconds} 秒后进行下一次循环`);
        await sleep(sleepSeconds * 500);
    }
}

function getRandomRpcUrl(rpcUrls) {
    const randomIndex = Math.floor(Math.random() * rpcUrls.length);
    return rpcUrls[randomIndex];
}

async function fetchRPC(url, body, headers = {}) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...headers  // 合并传入的请求头信息
        },
        signal: controller.signal
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP 错误! 状态: ${response.status}, 信息: ${await response.text()}`);
    }
    return response.json();
}

async function checkBalance(address, rpcUrl, headers) {
    const jsonRpcPayload = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
    };

    const response = await fetchRPC(rpcUrl, jsonRpcPayload, headers);
    if (response.error) {
        throw new Error(`RPC 错误: ${response.error.message}`);
    }

    return ethers.utils.formatUnits(response.result, 'ether');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomHeaders() {
    const headers = {
        'User-Agent': getRandomUserAgent(),
        'Accept': getRandomAcceptHeader(),
        'Referer': getRandomReferer(),
        // 可以根据需要添加其他的随机请求头
    };
    return headers;
}

function getRandomUserAgent() {
    const userAgents = [   
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/97.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:11.0) like Gecko',
        // 添加更多的用户代理字符串
        // 以下是额外添加的用户代理字符串
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.5000.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:12.0) like Gecko',
        'Mozilla/5.0 (X11; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 Edg/97.0.1072.62',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 OPR/97.0.4692.87',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_17_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 EdgA/97.0.1072.62',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_18_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 OPR/97.0.4692.87',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_19_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 EdgA/97.0.1072.62',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 Edg/97.0.1072.62',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_20_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36 OPR/97.0.4692.87',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 Edg/98.0.1108.55',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 OPR/98.0.4692.99',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 Edg/98.0.1108.55',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 OPR/98.0.4692.99',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 EdgA/98.0.1108.55',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 Edg/98.0.1108.55',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 OPR/98.0.4692.99',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 EdgA/98.0.1108.55',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 Edg/98.0.1108.55',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 OPR/98.0.4692.99',
        'Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 EdgA/98.0.1108.55',
        'Mozilla/5.0 (X11; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36 Edg/98.0.1108.55',
        'Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0',
        'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
        'Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.99 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4692.99 Safari/537.36',
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}


function getRandomAcceptHeader() {
    const acceptHeaders = [
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        // 添加更多的 Accept 头信息
    ];
    return acceptHeaders[Math.floor(Math.random() * acceptHeaders.length)];
}

function getRandomReferer() {
    const referers = [
        'https://www.google.com/',
        'https://www.bing.com/',
        'https://www.yahoo.com/',
        // 添加更多的 Referer
    ];
    return referers[Math.floor(Math.random() * referers.length)];
}

main().catch(console.error);
