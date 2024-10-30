import { Controller, Post, Body, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './create-payment.dto';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { JwtAuthGuard } from 'src/refreshTokens/jwt.auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
        const { amount, currency } = createPaymentDto;
        return this.paymentsService.createPaymentIntent(amount, currency);
    }

    @Post('webhook')
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const signatureHeader = req.headers['stripe-signature'];
        const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
        if (!signature) {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing stripe-signature header');
        }
        let event: Stripe.Event;
        try {
            event = this.paymentsService.verifyStripeSignature(req.body, signature);
            await this.paymentsService.handleWebhook(event);
            res.status(HttpStatus.OK).send({ received: true });
        } catch (err) {
            console.error('Webhook error:', err);
            res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }
    }
}