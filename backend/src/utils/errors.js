export class BadRequestError extends Error {
    constructor(error) {
      super(error.message);
   
      this.data = { error };
      this.statusCode = 400;
    }
  }

  export class NotFoundError extends Error {
    constructor(error) {
      super(error.message);
   
      this.data = { error };
      this.statusCode = 404;
    }
  }

  export class InternalServerError extends Error {
    constructor(error) {
      super(error.message);
   
      this.data = { error };
      this.statusCode = 500;
    }
  }