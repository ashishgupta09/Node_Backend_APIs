export interface RegisterDTO {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: "USER" | "ADMIN" | "MANAGER";
}

export interface LoginEmailOTPDTO {
    email: string;
}

export interface LoginPhoneOTPDTO {
    phone: string;
}

export interface VerifyLoginOTPDTO {
    email?: string;
    phone?: string;
    otp: string;
}
