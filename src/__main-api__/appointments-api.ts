import {
  addDays,
  endOfDay,
  setHours,
  setMinutes,
  startOfDay,
  subDays,
} from "date-fns";
import type { Appointment } from "../types/appointment";
import { createResourceId } from "../utils/create-resource-id";
import { deepCopy } from "../utils/deep-copy";

class AppointmentsApi {
  getEvents(): Promise<Appointment[]> {
    return Promise.resolve(deepCopy(events));
  }

  createEvent(data): Promise<Appointment> {
    return new Promise((resolve, reject) => {
      try {
        const { allDay, description, end, start, title } = data;

        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Create the new event
        const event = {
          id: createResourceId(),
          allDay,
          description,
          end,
          start,
          title,
        };

        // Add the new event to events
        clonedEvents.push(event);

        // Save changes
        events = clonedEvents;

        resolve(deepCopy(event));
      } catch (err) {
        console.error("[Appointment Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }

  updateEvent({ eventId, update }): Promise<Appointment> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Find the event that will be updated
        const event = events.find((_event) => _event.id === eventId);

        if (!event) {
          reject(new Error("Event not found"));
          return;
        }

        // Update the event
        Object.assign(event, update);

        // Save changes
        events = clonedEvents;

        resolve(deepCopy(event));
      } catch (err) {
        console.error("[Appointment Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }

  deleteEvent(eventId: string): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Find the event that will be removed
        const event = events.find((_event) => _event.id === eventId);

        if (!event) {
          reject(new Error("Event not found"));
          return;
        }

        events = events.filter((_event) => _event.id !== eventId);

        // Save changes
        events = clonedEvents;

        resolve(true);
      } catch (err) {
        console.error("[Appointment Api]: ", err);
        reject(new Error("Internal server error"));
      }
    });
  }
}
