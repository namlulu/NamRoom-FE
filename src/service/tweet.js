export default class TweetService {
  constructor(http, tokenStorage, socket) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.socket = socket;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    return this.http.fetch(`/messages${query}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async postTweet(text) {
    return this.http.fetch(`/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: this.getHeaders(),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/messages/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/messages/${tweetId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
      headers: this.getHeaders(),
    });
  }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  onSync(event, callback) {
    return this.socket.onSync(event, callback);
  }
}
