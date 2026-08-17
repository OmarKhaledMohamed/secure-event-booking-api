import {
  createBooking as createBookingService,
  getUserBookings,
  getBookingById as getBookingByIdService,
  updateBooking as updateBookingService,
  cancelBooking as cancelBookingService,
} from "../services/bookingService.js";

export const createBooking = async (req, res, next) => {
  try {
    const booking = await createBookingService({
      userId: req.user._id,
      eventId: req.body.event,
      seats: req.body.seats,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user._id);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await getBookingByIdService({
      bookingId: req.params.id,
      userId: req.user._id,
      role: req.user.role,
    });

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await updateBookingService({
      bookingId: req.params.id,
      userId: req.user._id,
      role: req.user.role,
      seats: req.body.seats,
    });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await cancelBookingService({
      bookingId: req.params.id,
      userId: req.user._id,
      role: req.user.role,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};