const express = require('express');
const router  = express.Router();

const {
    createPayment,
    confirmPayment,
    failPayment,
    confirmQrPayment,
    confirmCashPayment,
    getPendingCashPayments,
    getPayment,
    getPaymentsByUser,
    updatePaymentMethod,
    userCancelPayment,
    uploadQrCode,
    uploadQrMiddleware,
    getQrCode,
    getQrCodeBySpace,
    adminUpdatePaymentMethod,
    adminCancelPayment,
    getPaymentByReservation,
    adminGetAllPayments // ✅ make sure you imported this
} = require('../controllers/payments');

const { protect, authorize } = require('../middleware/auth');

// -------------------------------------------------------
// US2-1  Core payment
// -------------------------------------------------------
router.post('/',                  protect, createPayment);
router.put('/:id/confirm',        protect, confirmPayment);
router.put('/:id/fail',           protect, failPayment);

// -------------------------------------------------------
// US2-2  QR payment
// -------------------------------------------------------
router.put('/:id/confirm-qr',     protect, confirmQrPayment);
router.get('/:id/qr-code',        protect, getQrCode);

// Admin: QR by coworking space
router.get('/admin/qr-code/:spaceId', protect, authorize('admin'), getQrCodeBySpace);

// -------------------------------------------------------
// US2-3  Cash payment
// -------------------------------------------------------
router.put('/:id/confirm-cash',   protect, authorize('admin'), confirmCashPayment);
router.get('/pending-cash',       protect, authorize('admin'), getPendingCashPayments);

// -------------------------------------------------------
// US2-5  User change payment method
// -------------------------------------------------------
router.put('/:id/method',         protect, updatePaymentMethod);

// -------------------------------------------------------
// US2-6  User cancel payment
// -------------------------------------------------------
router.put('/:id/cancel',         protect, userCancelPayment);

// -------------------------------------------------------
// US2-7 Admin manage QR code
// -------------------------------------------------------
router.post('/admin/qr-code',     protect, authorize('admin'), uploadQrMiddleware, uploadQrCode);

// -------------------------------------------------------
// US2-8 Admin update payment method
// -------------------------------------------------------
router.put('/admin/:id/method',   protect, authorize('admin'), adminUpdatePaymentMethod);

// -------------------------------------------------------
// US2-9 Admin cancel payment
// -------------------------------------------------------
router.put('/admin/:id/cancel',   protect, authorize('admin'), adminCancelPayment);

// -------------------------------------------------------
// US2-4 User payments history
// -------------------------------------------------------
router.get('/user/:id',           protect, getPaymentsByUser);

// ✅ MUST come before `/:id`
router.get('/reservation/:reservationId', protect, getPaymentByReservation);

// ✅ MUST come before `/:id`
router.get('/admin/all', protect, authorize('admin'), adminGetAllPayments);

// -------------------------------------------------------
// LAST: generic ID route
// -------------------------------------------------------
router.get('/:id', protect, getPayment);

module.exports = router;