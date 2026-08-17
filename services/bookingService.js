import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createBooking = async ({ userId, eventId, seats }) => {
  /*
   * Atomically reserve seats.
   *
   * The update will only happen if:
   * availableSeats >= seats
   */
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      availableSeats: { $gte: seats },
    },
    {
      $inc: {
        availableSeats: -seats,
      },
    },
    {
      new: true,
    },
  );

  if (!event) {
    const existingEvent = await Event.findById(eventId);

    if (!existingEvent) {
      throw createError("Event not found", 404);
    }

    throw createError("Not enough seats available", 400);
  }

  try {
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      seats,
      status: "confirmed",
    });

    return booking;
  } catch (error) {
    /*
     * Booking creation failed after seats were reserved.
     * Restore the seats.
     */
    await Event.findByIdAndUpdate(eventId, {
      $inc: {
        availableSeats: seats,
      },
    });

    throw error;
  }
};

export const getUserBookings = async (userId) => {
  return await Booking.find({
    user: userId,
  })
    .populate("event")
    .sort({ createdAt: -1 });
};

export const getBookingById = async ({ bookingId, userId, role }) => {
  const booking = await Booking.findById(bookingId)
    .populate("event")
    .populate("user", "name email role");

  if (!booking) {
    throw createError("Booking not found", 404);
  }

  const isOwner = booking.user._id.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw createError("Forbidden: you can only access your own bookings", 403);
  }

  return booking;
};

export const updateBooking = async ({ bookingId, userId, role, seats }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw createError("Booking not found", 404);
  }

  const isOwner = booking.user.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw createError("Forbidden: you can only update your own bookings", 403);
  }

  if (booking.status === "cancelled") {
    throw createError("Cancelled booking cannot be updated", 400);
  }

  const oldSeats = booking.seats;
  const seatDifference = seats - oldSeats;

  // Increasing seats
  if (seatDifference > 0) {
    const event = await Event.findOneAndUpdate(
      {
        _id: booking.event,
        availableSeats: {
          $gte: seatDifference,
        },
      },
      {
        $inc: {
          availableSeats: -seatDifference,
        },
      },
      {
        new: true,
      },
    );

    if (!event) {
      const existingEvent = await Event.findById(booking.event);

      if (!existingEvent) {
        throw createError("Event not found", 404);
      }

      throw createError("Not enough seats available", 400);
    }

    try {
      booking.seats = seats;
      await booking.save();
    } catch (error) {
      await Event.findByIdAndUpdate(booking.event, {
        $inc: {
          availableSeats: seatDifference,
        },
      });

      throw error;
    }
  }

  // Decreasing seats
  else if (seatDifference < 0) {
    const seatsToReturn = Math.abs(seatDifference);

    const event = await Event.findByIdAndUpdate(
      booking.event,
      {
        $inc: {
          availableSeats: seatsToReturn,
        },
      },
      {
        new: true,
      },
    );

    if (!event) {
      throw createError("Event not found", 404);
    }

    try {
      booking.seats = seats;
      await booking.save();
    } catch (error) {
      await Event.findByIdAndUpdate(booking.event, {
        $inc: {
          availableSeats: -seatsToReturn,
        },
      });

      throw error;
    }
  }

  // Same number of seats
  else {
    booking.seats = seats;
    await booking.save();
  }

  return booking;
};

export const cancelBooking = async ({ bookingId, userId, role }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw createError("Booking not found", 404);
  }

  const isOwner = booking.user.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw createError("Forbidden: you can only cancel your own bookings", 403);
  }

  if (booking.status === "cancelled") {
    throw createError("Booking is already cancelled", 400);
  }

  const event = await Event.findByIdAndUpdate(
    booking.event,
    {
      $inc: {
        availableSeats: booking.seats,
      },
    },
    {
      new: true,
    },
  );

  if (!event) {
    throw createError("Event not found", 404);
  }

  try {
    booking.status = "cancelled";
    await booking.save();
  } catch (error) {
    await Event.findByIdAndUpdate(booking.event, {
      $inc: {
        availableSeats: -booking.seats,
      },
    });

    throw error;
  }

  return booking;
};
