class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;  // Assign the message parameter, not a boolean
    }
}

export { ApiResponse };
