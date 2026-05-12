const crypto = require('crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
    if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
        return false;
    }

    const [salt, originalHash] = storedHash.split(':');
    const candidateHash = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHash, 'hex');

    if (candidateHash.length !== originalBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(candidateHash, originalBuffer);
}

module.exports = { hashPassword, verifyPassword };
