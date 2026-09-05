const reportService = require('../services/report.service');

exports.getDashboardReports = async (req, res) => {
  try {
    // Run all aggregations concurrently in a Promise.all for maximum performance
    const [
      monthlySales,
      revenueByCategory,
      bestSellingProducts,
      topCustomers,
      averageProductRating,
      lowStockProducts
    ] = await Promise.all([
      reportService.getMonthlySales(),
      reportService.getRevenueByCategory(),
      reportService.getBestSellingProducts(),
      reportService.getTopCustomers(),
      reportService.getAverageProductRating(),
      reportService.getLowStockProducts()
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlySales,
        revenueByCategory,
        bestSellingProducts,
        topCustomers,
        averageProductRating,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate reports', error: error.message });
  }
};
