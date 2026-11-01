import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config.settings import settings
from app.database.mongo import db
from app.shared.models import utcnow

logger = logging.getLogger("email")


def _send_smtp(to: str, subject: str, body: str) -> None:
    msg = EmailMessage()
    msg["From"], msg["To"], msg["Subject"] = settings.email_from, to, subject
    msg.set_content(body)
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        smtp.starttls()
        if settings.smtp_user:
            smtp.login(settings.smtp_user, settings.smtp_password)
        smtp.send_message(msg)


async def send_email(to: str, subject: str, body: str, kind: str) -> None:
    """SMTP when configured; otherwise the message is kept in email_outbox (MOCKED delivery)."""
    if settings.smtp_host:
        await asyncio.to_thread(_send_smtp, to, subject, body)
        delivery = "smtp"
    else:
        delivery = "mocked_outbox"
        logger.warning("Email provider not configured: message '%s' stored in outbox", kind)
    await db.email_outbox.insert_one({"to": to, "subject": subject, "body": body, "kind": kind,
                                      "delivery": delivery, "created_at": utcnow()})
