// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class EventsService {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export interface Event {
  id: number;
  date: string;
  time: string;
  text: string;
}

@Injectable()
export class EventsService {
  private events: Event[] = [];

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const numericId = Number(id);
    const eventIndex = this.events.findIndex(event => event.id === numericId);
    if (eventIndex === -1) {
      return null;
    }
    this.events[eventIndex] = { ...this.events[eventIndex], ...updateEventDto };
    return this.events[eventIndex];
  }

  create(createEventDto: CreateEventDto): Event {
    const newEvent = {
      id: Date.now(),
      ...createEventDto,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  findAll(): Event[] {
    return this.events;
  }

  findOne(id: number): Event {
    const event = this.events.find(event => event.id === id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  update(id: number, updateEventDto: UpdateEventDto): Event {
    const event = this.findOne(id);
    Object.assign(event, updateEventDto);
    return event;
  }

  remove(id: number): void {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) throw new NotFoundException('Event not found');
    this.events.splice(index, 1);
  }
}
