import SockJS from 'sockjs-client/dist/sockjs';
import StompJs from 'stompjs/lib/stomp.js';
import { BASE_URL } from './helper';

const getSocketUrl = () => {
  const cleaned = BASE_URL.replace(/\/$/, '');
  const origin = cleaned.replace(/\/api\/v1$/, '');
  return `${origin}/api/v1/ws`;
};

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscription = null;
    this.isConnecting = false;
  }

  connect(onMessage, onConnected, onError) {
    // Avoid duplicate clients during React StrictMode effect re-runs.
    if (this.client || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const socket = new SockJS(getSocketUrl());
    this.client = StompJs.Stomp.over(socket);
    this.client.debug = () => {};

    this.client.connect(
      {},
      () => {
        this.isConnecting = false;
        this.subscription = this.client.subscribe('/topic/admin', (message) => {
          if (!message?.body) {
            return;
          }
          onMessage?.(JSON.parse(message.body));
        });
        onConnected?.();
      },
      (error) => {
        this.isConnecting = false;
        this.client = null;
        onError?.(error);
      }
    );
  }

  disconnect() {
    if (this.subscription && typeof this.subscription.unsubscribe === 'function') {
      try {
        this.subscription.unsubscribe();
      } catch (_) {
        // Ignore disconnect race errors from stale subscriptions.
      }
      this.subscription = null;
    }

    if (this.client) {
      try {
        if (this.client.connected) {
          this.client.disconnect(() => {});
        }
      } catch (_) {
        // Ignore "connection has not been established yet" during cleanup.
      }
      this.client = null;
    }

    this.isConnecting = false;
  }
}

const websocketService = new WebSocketService();
export default websocketService;
