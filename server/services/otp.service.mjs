import otp_generator from "otp-generator";

export const generateOTP = (len = 6) => {
    return otp_generator.generate(len, {
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
        digits: true
    })
}