class Socket {
  constructor({ onMessage }) {
    this.onMessage = onMessage || (() => {});
    this.pingInterval = 2000;
    this.interval = null;
    this.socket = null;
  }

  connect(url) {
    this.url = url;
    this.newSocket();
  }

  newSocket() {
    window.clearInterval(this.interval);

    if (this.socket) {
      this.onMessage('# disconnecting');
      this.socket.onopen = (() => {});
      this.socket.onerror = (() => {});
      this.socket.onmessage = (() => {});
      this.socket.onclose = (() => {});
      this.socket.close();
    }

    if (!this.url) {
      return;
    }

    this.onMessage(`# connecting to ${this.url}`);

    let newSocket;

    try {
      newSocket = new WebSocket(this.url);
    } catch (error) {
      window.setTimeout(() => this.newSocket(), 5000);
      return;
    }

    newSocket.onopen = () => {
      this.onMessage('# WebSocket connection opened');
    };

    newSocket.onerror = (error) => {
      this.onMessage(`# WebSocket Error: ${error.message}`);
      this.newSocket();
    };

    newSocket.onmessage = (event) => {
      this.onMessage(event.data);
    };

    newSocket.onclose = () => {
      this.onMessage('# WebSocket connection closed');
      this.newSocket();
    };

    this.interval = window.setInterval(() => {
      switch (this.socket.readyState) {
        case WebSocket.CLOSING:
        case WebSocket.CONNECTING:
          this.onMessage(this.socket.readyState === WebSocket.CLOSING ? '# CLOSING' : '# CONNECTING');
          break;
        case WebSocket.CLOSED:
          this.newSocket();
          break;
        case WebSocket.OPEN:
          this.socket.send('ping');
          break;
        default:
          this.onMessage(`# unknown websocket readyState ${this.socket.readyState}`);
      }
    }, this.pingInterval);

    this.socket = newSocket;
  }
}

export default Socket;
