const errorCode = Symbol('Error Code');
const errorData = Symbol('Error Data');

module.exports = class ZenjobError extends Error {
  constructor(code, message, data) {
    if (!(code && message)) {
      throw new ZenjobError(500, 'Code and Message are required in constructor');
    }
    super(message);
    this[errorCode] = code;
    this[errorData] = data;
  }

  get code() {
    return this[errorCode];
  }

  get data() {
    return this[errorData];
  }

  get toJson() {
    return {
      statusCode: this[errorCode],
      message: this.message,
      data: this[errorData],
    };
  }
};
