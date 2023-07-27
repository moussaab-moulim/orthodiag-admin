import { subDays, subHours } from 'date-fns';
import type { Appointment } from '../types/appointment';

const now = new Date();

class AppointmentApi {
  getAppointments(): Promise<Appointment[]> {
    const appointments: Appointment[] = [
      {
        id: '5ecb8a6d9f53bfae09e16115',
        createdAt: subDays(subHours(now, 4), 1).getTime(),
        currency: '$',
        customer: {
          address1: 'Street John Wick, no. 7',
          address2: 'House #25',
          city: 'San Diego',
          country: 'USA',
          email: 'miron.vitold@devias.io',
          name: 'Miron Vitold',
        },
        items: [
          {
            id: '5ecb8abbdd6dfb1f9d6bf98b',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Project Points',
            quantity: 25,
            unitAmount: 50.25,
          },
          {
            id: '5ecb8ac10f116d04bed990eb',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Freelancer Subscription',
            quantity: 1,
            unitAmount: 5.0,
          },
        ],
        number: 'DEV-102',
        paymentMethod: 'CreditCard',
        status: 'pending',
        totalAmount: 500.0,
        requestedDate: '2021-11-03 00:00:00.000',
        email: 'formmamsyusei@gmail.com',
        fullName: 'moussaab moulim',
        phoneNumber: '+212 6 55 199559',
        practice: {
          id: 1,
          address: 'Avenue de la Gare 51, 2000 Neuchâtel.',
          city: 'Neuchâtel',
          image: {
            id: 'assets/images/practices/neuchatel-dentiste.jpg',
            path: 'assets/images/practices/neuchatel-dentiste.jpg',
          },
          latitude: 3.4,
          longitude: 3.5,
          name: "Cabinets d'orthodontie Dr Grier",
          rating: 4,
        },
      },
      {
        id: '5ecb8a738aa6f3e577c2b3ec',
        createdAt: subDays(subHours(now, 7), 1).getTime(),
        currency: '$',
        customer: {
          address1: 'Street John Wick, no. 7',
          address2: 'House #25',
          city: 'San Diego',
          country: 'USA',
          email: 'miron.vitold@devias.io',
          name: 'Miron Vitold',
        },
        items: [
          {
            id: '5ecb8abbdd6dfb1f9d6bf98b',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Project Points',
            quantity: 25,
            unitAmount: 50.25,
          },
          {
            id: '5ecb8ac10f116d04bed990eb',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Freelancer Subscription',
            quantity: 1,
            unitAmount: 5.0,
          },
        ],
        number: 'DEV-101',
        paymentMethod: 'PayPal',
        status: 'approuved',
        totalAmount: 324.5,
        requestedDate: '2021-12-08 00:00:00.000',
        email: 'formmamsyusei@gmail.com',
        fullName: 'moussaab moulim',
        phoneNumber: '+212 6 55 199559',
        practice: {
          id: 1,
          address: 'Avenue de la Gare 51, 2000 Neuchâtel.',
          city: 'Neuchâtel',
          image: {
            id: 'assets/images/practices/neuchatel-dentiste.jpg',
            path: 'assets/images/practices/neuchatel-dentiste.jpg',
          },
          latitude: 3.4,
          longitude: 3.5,
          name: "Cabinets d'orthodontie Dr Grier",
          rating: 4,
        },
      },
      {
        id: '5ecb8a795e53f134013eba3b',
        createdAt: subDays(subHours(now, 2), 2).getTime(),
        currency: '$',
        customer: {
          address1: 'Street John Wick, no. 7',
          address2: 'House #25',
          city: 'San Diego',
          country: 'USA',
          email: 'miron.vitold@devias.io',
          name: 'Miron Vitold',
        },
        items: [
          {
            id: '5ecb8abbdd6dfb1f9d6bf98b',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Project Points',
            quantity: 25,
            unitAmount: 50.25,
          },
          {
            id: '5ecb8ac10f116d04bed990eb',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Freelancer Subscription',
            quantity: 1,
            unitAmount: 5.0,
          },
        ],
        number: 'DEV-100',
        paymentMethod: 'CreditCard',
        status: 'canceled',
        totalAmount: 746.5,
        requestedDate: '2021-11-29 00:00:00.000',
        email: 'formmamsyusei@gmail.com',
        fullName: 'moussaab moulim',
        phoneNumber: '+212 6 55 199559',
        practice: {
          id: 1,
          address: 'Avenue de la Gare 51, 2000 Neuchâtel.',
          city: 'Neuchâtel',
          image: {
            id: 'assets/images/practices/neuchatel-dentiste.jpg',
            path: 'assets/images/practices/neuchatel-dentiste.jpg',
          },
          latitude: 3.4,
          longitude: 3.5,
          name: "Cabinets d'orthodontie Dr Grier",
          rating: 4,
        },
      },
      {
        id: '5ecb8a7f738cc572a9ce0277',
        createdAt: subDays(subHours(now, 3), 5).getTime(),
        currency: '$',
        customer: {
          address1: 'Street John Wick, no. 7',
          address2: 'House #25',
          city: 'San Diego',
          country: 'USA',
          email: 'miron.vitold@devias.io',
          name: 'Miron Vitold',
        },
        items: [
          {
            id: '5ecb8abbdd6dfb1f9d6bf98b',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Project Points',
            quantity: 25,
            unitAmount: 50.25,
          },
          {
            id: '5ecb8ac10f116d04bed990eb',
            billingCycle: 'monthly',
            currency: '$',
            name: 'Freelancer Subscription',
            quantity: 1,
            unitAmount: 5.0,
          },
        ],
        number: 'DEV-99',
        paymentMethod: 'PayPal',
        status: 'rejected',
        totalAmount: 56.89,
        requestedDate: '2021-11-16 00:00:00.000',
        email: 'formmamsyusei@gmail.com',
        fullName: 'moussaab moulim',
        phoneNumber: '+212 6 55 199559',
        practice: {
          id: 1,
          address: 'Avenue de la Gare 51, 2000 Neuchâtel.',
          city: 'Neuchâtel',
          image: {
            id: 'assets/images/practices/neuchatel-dentiste.jpg',
            path: 'assets/images/practices/neuchatel-dentiste.jpg',
          },
          latitude: 3.4,
          longitude: 3.5,
          name: "Cabinets d'orthodontie Dr Grier",
          rating: 4,
        },
      },
    ];

    return Promise.resolve(appointments);
  }

  getAppointment(): Promise<Appointment> {
    const appointment: Appointment = {
      id: '5ecb8a6879877087d4aa2690',
      coupon: null,
      createdAt: subDays(subHours(now, 4), 1).getTime(),
      currency: '$',
      customer: {
        address1: 'Street John Wick, no. 7',
        address2: 'House #25',
        city: 'San Diego',
        country: 'USA',
        email: 'miron.vitold@devias.io',
        name: 'Miron Vitold',
      },
      items: [
        {
          id: '5ecb8abbdd6dfb1f9d6bf98b',
          billingCycle: 'monthly',
          currency: '$',
          name: 'Project Points',
          quantity: 25,
          unitAmount: 50.25,
        },
        {
          id: '5ecb8ac10f116d04bed990eb',
          billingCycle: 'monthly',
          currency: '$',
          name: 'Freelancer Subscription',
          quantity: 1,
          unitAmount: 5.0,
        },
      ],
      number: 'DEV-103',
      paymentMethod: 'CreditCard',
      promotionCode: 'PROMO1',
      status: 'pending',
      totalAmount: 500.0,
      requestedDate: '2021-11-16 00:00:00.000',
      email: 'formmamsyusei@gmail.com',
      fullName: 'moussaab moulim',
      phoneNumber: '+212 6 55 199559',
      practice: {
        id: 1,
        address: 'Avenue de la Gare 51, 2000 Neuchâtel.',
        city: 'Neuchâtel',
        image: {
          id: 'assets/images/practices/neuchatel-dentiste.jpg',
          path: 'assets/images/practices/neuchatel-dentiste.jpg',
        },
        latitude: 3.4,
        longitude: 3.5,
        name: "Cabinets d'orthodontie Dr Grier",
        rating: 4,
      },
    };

    return Promise.resolve(appointment);
  }
}

export const appointmentApi = new AppointmentApi();
