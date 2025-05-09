import smtplib
from email.mime.text import MIMEText


def send_reset_email(email: str, reset_token: str):
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    msg = MIMEText(f"Click the link to reset your password: {reset_link}")
    msg["Subject"] = "Password Reset Request"
    msg["From"] = "noreply@yourapp.com"
    msg["To"] = email

    try:
        with smtplib.SMTP("smtp.yourprovider.com", 587) as server:
            server.starttls()
            server.login("your-email@example.com", "your-password")
            server.sendmail("noreply@yourapp.com", email, msg.as_string())
        print(f"Password reset email sent to {email}")
    except Exception as e:
        print(f"Error sending email: {e}")
