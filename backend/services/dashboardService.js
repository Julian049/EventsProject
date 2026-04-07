const DashboardModel = require('../models/dashboardModel');

exports.getGlobalMetrics = () => {
    return DashboardModel.getGlobalMetrics();
}

exports.getSalesByEvent = () => {
    return DashboardModel.getSalesByEvent();
}