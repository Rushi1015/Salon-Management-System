const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const Wage = require('../models/Wage');

const getCustomerDashboard = async (req, res) => {
  try {
    const customerId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const [upcomingAppointments, pastAppointments, recentOrders, totalSpent] = await Promise.all([
      Appointment.find({
        customer: customerId,
        date: { $gte: today },
        status: { $nin: ['Cancelled', 'Completed'] },
      })
        .populate('barber', 'name avatar')
        .populate('service', 'name price duration category')
        .sort({ date: 1, timeSlot: 1 })
        .limit(5),

      Appointment.find({
        customer: customerId,
        status: 'Completed',
      })
        .populate('barber', 'name')
        .populate('service', 'name price category')
        .sort({ date: -1 })
        .limit(10),

      Order.find({ customer: customerId })
        .sort({ createdAt: -1 })
        .limit(5),

      Appointment.aggregate([
        { $match: { customer: customerId, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    // Favorite services (most booked)
    const favoriteServices = await Appointment.aggregate([
      { $match: { customer: customerId, status: 'Completed' } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceInfo',
        },
      },
      { $unwind: '$serviceInfo' },
      {
        $project: {
          name: '$serviceInfo.name',
          category: '$serviceInfo.category',
          price: '$serviceInfo.price',
          bookings: '$count',
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        upcomingAppointments,
        pastAppointments,
        recentOrders,
        favoriteServices,
        totalSpent: totalSpent[0]?.total || 0,
        totalAppointments: pastAppointments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBarberDashboard = async (req, res) => {
  try {
    const barberId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [todayAppointments, upcomingAppointments, monthlyEarnings, totalCompleted] = await Promise.all([
      Appointment.find({
        barber: barberId,
        date: today,
        status: { $nin: ['Cancelled'] },
      })
        .populate('customer', 'name phone')
        .populate('service', 'name duration price')
        .sort({ timeSlot: 1 }),

      Appointment.find({
        barber: barberId,
        date: { $gt: today },
        status: { $nin: ['Cancelled'] },
      })
        .populate('customer', 'name')
        .populate('service', 'name price')
        .sort({ date: 1, timeSlot: 1 })
        .limit(10),

      Wage.aggregate([
        { $match: { barber: barberId, month: currentMonth, year: currentYear } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$totalEarning' },
            totalCommission: { $sum: '$commissionEarned' },
            servicesCompleted: { $sum: 1 },
          },
        },
      ]),

      Appointment.countDocuments({ barber: barberId, status: 'Completed' }),
    ]);

    // If no wage records exist for this month, compute revenue directly from completed appointments
    let earningsData = monthlyEarnings[0] || null;
    if (!earningsData) {
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
      const completedAppts = await Appointment.aggregate([
        {
          $match: {
            barber: barberId,
            status: 'Completed',
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
      ]);
      const commissionRate = req.user.commissionRate || 30;
      const totalRevenue = completedAppts[0]?.totalRevenue || 0;
      earningsData = {
        totalEarnings: (totalRevenue * commissionRate) / 100,
        totalCommission: (totalRevenue * commissionRate) / 100,
        servicesCompleted: completedAppts[0]?.count || 0,
      };
    }

    res.json({
      success: true,
      data: {
        todayAppointments,
        upcomingAppointments,
        monthlyEarnings: earningsData,
        totalCompleted,
        commissionRate: req.user.commissionRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReceptionistDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [todayAppointments, pendingAppointments, availableBarbers, recentCustomers, todayRevenue] = await Promise.all([
      Appointment.find({ date: today })
        .populate('customer', 'name phone')
        .populate('barber', 'name')
        .populate('service', 'name duration')
        .sort({ timeSlot: 1 }),

      Appointment.find({ status: 'Pending' })
        .populate('customer', 'name phone')
        .populate('barber', 'name')
        .populate('service', 'name')
        .sort({ date: 1 })
        .limit(10),

      User.find({ role: 'Barber', isActive: true }).select('name specializations workingHours'),

      User.find({ role: 'Customer' })
        .select('name email phone')
        .sort({ createdAt: -1 })
        .limit(10),

      Appointment.aggregate([
        { $match: { date: today, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        todayAppointments,
        pendingAppointments,
        availableBarbers,
        recentCustomers,
        todayCount: todayAppointments.length,
        pendingCount: pendingAppointments.length,
        todayRevenue: todayRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCustomerDashboard, getBarberDashboard, getReceptionistDashboard };
