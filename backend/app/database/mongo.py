

from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config.settings import settings

client: AsyncIOMotorClient = AsyncIOMotorClient(settings.mongo_url, tz_aware=True)
db = client[settings.db_name]