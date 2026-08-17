import {
  createEvent as createEventService,
  getAllEvents,
  getEventById,
  updateEvent as updateEventService,
  deleteEvent as deleteEventService,
} from "../services/eventService.js";

export const createEvent = async (req, res, next) => {
  try {
    const event = await createEventService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const events = await getAllEvents();

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await updateEventService(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await deleteEventService(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
