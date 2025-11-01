import axios from 'axios';
import { printfulService } from './printfulService';

// Placeholder API keys - these should be set in .env and not hard-coded
const STRIPE_API_KEY = import.meta.env.VITE_STRIPE_API_KEY || 'placeholder-stripe-key';
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'placeholder-paypal-client-id';
const PAYPAL_SECRET = import.meta.env.VITE_PAYPAL_SECRET || 'placeholder-paypal-secret';

// Stripe API configuration
const stripeClient = axios.create({
  baseURL: 'https://api.stripe.com/v1',
  headers: {
    'Authorization': `Bearer ${STRIPE_API_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// PayPal API configuration
const paypalClient = axios.create({
  baseURL: 'https://api-m.sandbox.paypal.com', // Use sandbox for testing, switch to live for production
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: PAYPAL_CLIENT_ID,
    password: PAYPAL_SECRET,
  },
});

// Payment service object
export const paymentService = {
  // Initiate payment with Stripe
  async initiateStripePayment(paymentData) {
    try {
      // Validate required fields
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      const params = new URLSearchParams();
      params.append('amount', Math.round(paymentData.amount * 100)); // Convert to cents
      params.append('currency', paymentData.currency || 'usd');
      params.append('description', paymentData.description || 'Payment for order');
      params.append('source', 'tok_visa'); // Test token, replace with actual token from frontend in production

      const response = await stripeClient.post('/charges', params.toString());
      
      if (response.data.status === 'succeeded') {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: 'Payment was not successful',
        };
      }
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to process Stripe payment';
      if (error.response) {
        errorMessage = error.response.data?.error?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || null,
      };
    }
  },

  // Initiate payment with PayPal
  async initiatePayPalPayment(paymentData) {
    try {
      // Validate required fields
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      const response = await paypalClient.post('/v2/checkout/orders', {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: paymentData.currency || 'USD',
            value: paymentData.amount.toFixed(2),
          },
          description: paymentData.description || 'Payment for order',
        }],
        application_context: {
          return_url: 'http://localhost:5173/payment-success', // Replace with actual return URL
          cancel_url: 'http://localhost:5173/payment-cancel', // Replace with actual cancel URL
        },
      });

      if (response.data.status === 'CREATED') {
        const approvalLink = response.data.links?.find(link => link.rel === 'approve');
        return {
          success: true,
          data: response.data,
          approvalUrl: approvalLink?.href || null,
        };
      } else {
        return {
          success: false,
          error: 'Failed to create PayPal order',
        };
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to process PayPal payment';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error_description || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || null,
      };
    }
  },

  // Generic payment initiation method to choose provider
  async initiatePayment(paymentData, provider = 'stripe') {
    if (provider === 'stripe') {
      return await this.initiateStripePayment(paymentData);
    } else if (provider === 'paypal') {
      return await this.initiatePayPalPayment(paymentData);
    } else {
      return {
        success: false,
        error: 'Unsupported payment provider',
      };
    }
  },

  // Create order in Printful after successful payment
  async createPrintfulOrder(orderData) {
    try {
      // Validate order data
      if (!orderData.recipient) {
        throw new Error('Recipient information is required');
      }
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const response = await printfulService.createOrder(orderData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error creating Printful order:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to create Printful order';
      if (error.response) {
        errorMessage = error.response.data?.result?.error?.message || error.response.data?.error?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || null,
      };
    }
  },

  // Check order status in Printful
  async checkOrderStatus(orderId) {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await printfulService.getOrderStatus(orderId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error checking Printful order status:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to check Printful order status';
      if (error.response) {
        errorMessage = error.response.data?.result?.error?.message || error.response.data?.error?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || null,
      };
    }
  },
};

export default paymentService;
