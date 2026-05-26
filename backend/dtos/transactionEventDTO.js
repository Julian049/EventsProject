function createTransactionEventDTO({ purchaseId, eventName, description, error, message }) {
    return {
        purchaseId,
        eventName,
        description,
        error,
        message
    };
}

module.exports = { createTransactionEventDTO };