
export class apiResponse {
    private status: number | null
    private message: string | null
    private data: any | null
    private error: any | null
    constructor(status: number, message: string, data: any, error: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}

export const userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload",
    artist : "artist"
}

export const file_path = ['profile' , "portfolio"]

export const SMS_message = {
    OTP_verification: `FMM app verification code:`,
    OTP_forgot_password: `FMM app forgot password verification code:`,
}