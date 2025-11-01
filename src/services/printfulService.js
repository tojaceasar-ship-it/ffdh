import axios from 'axios';

// Printful API base URL
const PRINTFUL_API_URL = 'https://api.printful.com';

// Placeholder for API key - this should be set in .env and not hard-coded
const PRINTFUL_API_KEY = import.meta.env.VITE_PRINTFUL_API_KEY || 'placeholder-api-key';

// Axios instance with Printful API configuration
const printfulClient = axios.create({
  baseURL: PRINTFUL_API_URL,
  headers: {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Service object for Printful API interactions
export const printfulService = {
  // Fetch all products from Printful
  async getProducts() {
    try {
      const response = await printfulClient.get('/store/products');
      
      if (!response.data) {
        throw new Error('Invalid response from Printful API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching products from Printful:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to fetch products from Printful';
      if (error.response?.data) {
        errorMessage = error.response.data.error?.message || error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Fetch a single product by ID
  async getProductById(id) {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const response = await printfulClient.get(`/store/products/${id}`);
      
      if (!response.data) {
        throw new Error('Invalid response from Printful API');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id} from Printful:`, error);
      
      // Extract meaningful error message
      let errorMessage = `Failed to fetch product ${id} from Printful`;
      if (error.response?.data) {
        errorMessage = error.response.data.error?.message || error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Create an order in Printful
  async createOrder(orderData) {
    try {
      if (!orderData || typeof orderData !== 'object') {
        throw new Error('Invalid order data provided');
      }

      const response = await printfulClient.post('/orders', orderData);
      
      if (!response.data) {
        throw new Error('Invalid response from Printful API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating order in Printful:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to create order in Printful';
      if (error.response?.data) {
        errorMessage = error.response.data.error?.message || error.response.data.result?.error?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Get order status by ID
  async getOrderStatus(orderId) {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await printfulClient.get(`/orders/${orderId}`);
      
      if (!response.data) {
        throw new Error('Invalid response from Printful API');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching order status for ${orderId} from Printful:`, error);
      
      // Extract meaningful error message
      let errorMessage = `Failed to fetch order status for ${orderId} from Printful`;
      if (error.response?.data) {
        errorMessage = error.response.data.error?.message || error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Webhook handler for Printful updates (to be called by API route)
  handleWebhook(webhookData) {
    // Process webhook data (e.g., update order status in local database)
    console.log('Received Printful webhook:', webhookData);
    // Implementation depends on how order status updates are managed in the app
    return { status: 'Webhook received' };
  },
};

export default printfulService;
