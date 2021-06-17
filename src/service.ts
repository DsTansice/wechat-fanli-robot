import rp from 'request-promise';

export default class Service {
  async send(msg: string) {
    const opt = {
      method: 'POST',
      uri: 'http://127.0.0.1:4000/api/msg',
      json: true,
      strictSSL: false,
      body: { msg },
    };
    return rp(opt);
  }
}
