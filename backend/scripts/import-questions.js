// ===== IMPORT QUESTIONS SEED INTO DB =====
const { assertRequired } = require('../src/config/env');
const { getPool, closePool } = require('../src/database/pool');
const questionService = require('../src/services/question.service');
const seed = require('../src/database/seeds/questions.seed');

async function main() {
    assertRequired();
    console.log('🚀 Bắt đầu import câu hỏi vào database...\n');

    try {
        await getPool().query('SELECT NOW()');
        console.log(`📥 Đang import ${seed.length} câu hỏi...`);

        const result = await questionService.bulkReplace(seed);

        console.log(`\n📊 Kết quả:`);
        console.log(`   ✅ Thành công: ${result.success} câu`);
        console.log(`   ❌ Lỗi: ${result.errors.length} câu`);
        if (result.errors.length) {
            result.errors.slice(0, 10).forEach((e) => console.log(`      - Câu ${e.id}: ${e.message}`));
        }
        console.log('\n🎉 Import hoàn tất!');
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exitCode = 1;
    } finally {
        await closePool();
    }
}

main();
