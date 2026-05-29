function createTransactionEventDTO({ userId,purchaseId, eventName, description, error, message }) {
    return {
        userId,
        purchaseId,
        eventName,
        description,
        error,
        message
    };
}

module.exports = { createTransactionEventDTO };