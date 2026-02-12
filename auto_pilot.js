require('dotenv').config();
const axios = require('axios');

const ZAP_HOOK_URL = process.env.ZAP_HOOK_URL;

/**
 * 네이트 최신 실시간 이슈 키워드를 완벽하게 파싱
 */
async function getTrendingKeyword() {
    try {
        console.log('🔍 실시간 트렌드 정밀 분석 중...');

        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

        const url = `https://www.nate.com/js/data/jsonLiveKeywordDataV1.js?v=${timestamp}`;

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            responseType: 'text'
        });

        // 숫자만 있는 것이 아니라 실제 키워드 텍스트만 추출
        const match = data.match(/\["(.*?)",/g);
        if (match) {
            const keywords = match.map(m => m.replace(/\["|",/g, ''));

            // 숫자로만 된 키워드(예: "1", "10") 제외하고 실제 한글/영문 키워드만 필터링
            const realKeywords = keywords.filter(k => isNaN(k) && k.length > 1);

            if (realKeywords.length > 0) {
                const randomPick = realKeywords[Math.floor(Math.random() * realKeywords.length)];
                console.log(`✨ 실시간 키워드 발견: [${randomPick}]`);
                return randomPick;
            }
        }

        return '2026년 유망 재테크 트렌드';
    } catch (error) {
        return '2026년 유망 재테크 트렌드';
    }
}

async function runAutoPilot() {
    console.log('\n🚀 오토파일럿 모드 가동!');
    const topic = await getTrendingKeyword();

    try {
        await axios.post(ZAP_HOOK_URL, {
            topic: topic,
            tone: '친근하고 아주 구체적인',
            target: '블로그 이웃들',
            full_prompt: `주제: ${topic}`,
            timestamp: new Date().toISOString()
        });
        console.log(`✅ 성공: [${topic}] 주제로 자동 포스팅을 시작합니다.`);
    } catch (error) {
        console.error('❌ 실패:', error.message);
    }
}

runAutoPilot();
