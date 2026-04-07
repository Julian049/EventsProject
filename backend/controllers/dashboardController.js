const dashboardService = require('../services/dashboardService');

exports.getGlobalMetrics = async (req, res) => {
    try {
        const metrics = await dashboardService.getGlobalMetrics();
        res.status(200).json(metrics);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getSalesByEvent = async (req, res) => {
    try {
        const report = await dashboardService.getSalesByEvent();
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}