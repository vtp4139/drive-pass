const fs = require('fs');
const path = require('path');

const FIRST_PAGE =
    'https://laihay.vn/cau_hoi_luyen_thi/phan-cua-duong-bo-duoc-su-dung-cho-phuong-tien-giao-thong-duong-bo-di-lai-la-gi/';
const WP_COLLECTION =
    'https://laihay.vn/wp-json/wp/v2/cau_hoi_luyen_thi?per_page=100&orderby=id&order=asc&_fields=id,link';
const OUTPUT_PATH = path.resolve(__dirname, '../src/database/seeds/questions.seed.js');
const SNAPSHOT_PATH = path.resolve(__dirname, '../tmp/questions-600-laihay.json');

const CATEGORY_RANGES = [
    { from: 1, to: 180, name: 'Quy định chung và quy tắc giao thông đường bộ' },
    {
        from: 181,
        to: 205,
        name: 'Văn hóa giao thông, đạo đức người lái xe, kỹ năng phòng cháy, chữa cháy và cứu hộ, cứu nạn',
    },
    { from: 206, to: 263, name: 'Kỹ thuật lái xe' },
    { from: 264, to: 300, name: 'Cấu tạo và sửa chữa' },
    { from: 301, to: 485, name: 'Báo hiệu đường bộ' },
    { from: 486, to: 600, name: 'Giải thế sa hình và kỹ năng xử lý tình huống giao thông' },
];

const CRITICAL_QUESTION_IDS = new Set([
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 34, 35, 36, 47, 48, 52, 53, 55,
    58, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 85, 86, 87, 88, 89, 90, 91, 92,
    93, 97, 98, 102, 117, 163, 165, 197, 198, 206, 216, 226, 234, 245, 246, 252,
    253, 254, 255, 260,
]);

const MANUAL_OVERRIDES = {
    352: {
        answers: ['Biển 1.', 'Biển 2.', 'Cả hai biển.'],
        correct: 0,
    },
};

function decodeHtml(value = '') {
    return value
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');
}

function cleanText(value = '') {
    return decodeHtml(
        value
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
    )
        .replace(/\r/g, '')
        .replace(/\u00a0/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

function findMatch(html, regex, label) {
    const match = html.match(regex);
    if (!match) {
        throw new Error(`Không parse được ${label}`);
    }
    return match[1];
}

function getCategory(id) {
    const match = CATEGORY_RANGES.find((range) => id >= range.from && id <= range.to);
    if (!match) {
        throw new Error(`Không xác định được category cho câu ${id}`);
    }
    return match.name;
}

function shouldMergeChoice(previous, current) {
    if (!previous || !current) return false;
    if (/[.!?;:]$/.test(previous.text)) return false;
    return /^[a-zàáạảãăắằẳẵặâấầẩẫậđèéẹẻẽêếềểễệìíịỉĩòóọỏõôốồổỗộơớờởỡợùúụủũưứừửữựỳýỵỷỹ]/iu.test(
        current.text
    );
}

function normalizeChoices(rawChoices) {
    return rawChoices.reduce((acc, choice) => {
        const previous = acc[acc.length - 1];
        if (shouldMergeChoice(previous, choice)) {
            const joiner =
                /[\p{L}\p{N}]$/u.test(previous.text) && /^[\p{L}\p{N}]/u.test(choice.text)
                    ? ''
                    : ' ';
            previous.text = `${previous.text}${joiner}${choice.text}`.trim();
            previous.originalNumbers.push(choice.number);
            return acc;
        }

        acc.push({
            text: choice.text,
            originalNumbers: [choice.number],
        });
        return acc;
    }, []);
}

function expandCollapsedChoices(rawChoices) {
    if (rawChoices.length !== 1) return rawChoices;

    const parts = [...rawChoices[0].text.matchAll(/(\d+)\.\s*([\s\S]*?)(?=(?:\d+\.\s*)|$)/g)]
        .map((match) => ({
            number: Number(match[1]),
            text: cleanText(match[2]),
        }))
        .filter((choice) => choice.text);

    return parts.length >= 2 ? parts : rawChoices;
}

function extractQuestionData(html, index, url) {
    const question = cleanText(
        findMatch(html, /<h1 class="single-question-title">([\s\S]*?)<\/h1>/i, 'title')
    );

    const choicesBlock = findMatch(
        html,
        /<div class="question-choices">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Cột phải:/i,
        'choices block'
    );
    const choiceMatches = [
        ...choicesBlock.matchAll(
            /<div class="choice-item"><span class="choice-number">(\d+)<\/span><span class="choice-text">([\s\S]*?)<\/span><\/div>/gi
        ),
    ];

    if (!choiceMatches.length) {
        throw new Error(`Không parse được đáp án lựa chọn ở ${url}`);
    }

    const rawChoices = expandCollapsedChoices(
        choiceMatches
        .sort((a, b) => Number(a[1]) - Number(b[1]))
        .map((match) => ({
            number: Number(match[1]),
            text: cleanText(match[2]),
        }))
    );

    const correctText = cleanText(
        findMatch(
            html,
            /<span class="result-label">Đáp án số:<\/span>\s*<span class="result-value"[^>]*>(\d+)<\/span>/i,
            'correct answer'
        )
    );
    const correctNumber = Number(correctText);
    const normalizedChoices = normalizeChoices(rawChoices);
    const answers = normalizedChoices.map((choice) => choice.text);
    const correct = normalizedChoices.findIndex((choice) =>
        choice.originalNumbers.includes(correctNumber)
    );
    if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
        throw new Error(`Đáp án đúng không hợp lệ ở ${url}`);
    }

    const criticalText = cleanText(
        findMatch(
            html,
            /<span class="result-label">Câu điểm liệt:<\/span>\s*<span class="result-value[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
            'critical flag'
        )
    );
    const isCritical = /có/i.test(criticalText) || CRITICAL_QUESTION_IDS.has(index);

    const imageMatch = html.match(
        /<div class="single-question-image">\s*<img[^>]+src="([^"]+)"/i
    );
    const image = imageMatch ? decodeHtml(imageMatch[1]).trim() : null;

    const baseQuestion = {
        id: index,
        category: getCategory(index),
        question,
        answers,
        correct,
        explanation: '',
        isCritical,
        ...(image ? { image } : {}),
    };

    return {
        ...baseQuestion,
        ...(MANUAL_OVERRIDES[index] || {}),
    };
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Tải JSON thất bại: ${response.status} ${response.statusText}`);
    }
    return {
        data: await response.json(),
        totalPages: Number(response.headers.get('x-wp-totalpages') || 1),
    };
}

async function fetchText(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Tải HTML thất bại (${response.status}) tại ${url}`);
    }
    return response.text();
}

async function fetchAllLinks() {
    const pages = [];
    const firstPage = await fetchJson(`${WP_COLLECTION}&page=1`);
    pages.push(...firstPage.data);

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
        const { data } = await fetchJson(`${WP_COLLECTION}&page=${page}`);
        if (!Array.isArray(data) || !data.length) break;
        pages.push(...data);
    }

    const filtered = pages.filter((item) => item.link && item.link.includes('/cau_hoi_luyen_thi/'));
    if (filtered.length < 600) {
        throw new Error(`Chỉ lấy được ${filtered.length} link câu hỏi`);
    }

    return filtered
        .sort((a, b) => a.id - b.id)
        .slice(0, 600)
        .map((item) => item.link);
}

async function main() {
    const links = await fetchAllLinks();
    if (links[0] !== FIRST_PAGE) {
        throw new Error(`Link đầu tiên không khớp câu 1: ${links[0]}`);
    }

    const questions = [];
    for (let i = 0; i < links.length; i += 1) {
        const id = i + 1;
        const url = links[i];
        const html = await fetchText(url);
        const question = extractQuestionData(html, id, url);
        questions.push(question);
        console.log(`Đã parse câu ${id}/600`);
    }

    fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(questions, null, 2), 'utf8');

    const fileContent = `// ===== QUESTIONS SEED DATA =====\n// Đồng bộ từ bộ 600 câu hỏi GPLX 2025.\nmodule.exports = ${JSON.stringify(
        questions,
        null,
        4
    )};\n`;
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf8');

    console.log(`Đã ghi ${questions.length} câu vào ${OUTPUT_PATH}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
