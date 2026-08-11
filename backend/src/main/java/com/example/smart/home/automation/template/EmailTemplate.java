package com.example.smart.home.automation.template;

public class EmailTemplate {

    public static String otp(String code) {

        return String.format("""
                    <html>
                        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; text-align: center;">
                                <h2 style="color: #4CAF50;">Reset Password</h2>
                                <p>We received a request to reset the password for your account. Please use the following verification code to continue:</p>
                                <h1 style="letter-spacing: 5px; color: #333;">%s</h1>
                                <p>This code will expire in <b>2 minutes</b>. Do not share this code with anyone.</p>
                                <p style="color: #888;">If you did not request a password reset, you can safely ignore this email. Your account will remain secure.</p>
                            </div>
                        </body>
                    </html>
                """, code);

    }

}