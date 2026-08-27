import Event from "../models/Event.js";

export const createEvent = async (data, userId) => {
  const event = await Event.create({
    ...data,
    organizer: userId,
    availableSeats: data.totalSeats,
  });

  return event;
};

export const getAllEvents = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit),

    Event.countDocuments(),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate(
    "organizer",
    "name email",
  );

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

export const updateEvent = async (eventId, data, user) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  // Organizer can only update their own events
  if (
    user.role === "organizer" &&
    event.organizer.toString() !== user._id.toString()
  ) {
    const error = new Error("Forbidden: you can only manage your own events");
    error.statusCode = 403;
    throw error;
  }

  if (data.totalSeats !== undefined) {
    const bookedSeats = event.totalSeats - event.availableSeats;

    if (data.totalSeats < bookedSeats) {
      const error = new Error(
        "Total seats cannot be less than already booked seats",
      );
      error.statusCode = 400;
      throw error;
    }

    data.availableSeats = data.totalSeats - bookedSeats;
  }

  Object.assign(event, data);

  await event.save();

  return event;
};

export const deleteEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    user.role === "organizer" &&
    event.organizer.toString() !== user._id.toString()
  ) {
    const error = new Error("Forbidden: you can only manage your own events");
    error.statusCode = 403;
    throw error;
  }

  await event.deleteOne();

  return event;
};
