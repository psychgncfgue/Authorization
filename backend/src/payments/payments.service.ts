import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new HttpException('Error creating payment intent', HttpStatus.BAD_REQUEST);
    }
  }

  verifyStripeSignature(payload: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new HttpException(`Webhook signature verification failed: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        break;
      case 'payment_intent.payment_failed':
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}