from fastapi import APIRouter, Depends

from app.core.authorization.deps import ProductContext, require_product
from app.database.mongo import db

P = "link_bio"
COLLECTIONS = ["bio_pages", "bio_links", "bio_themes", "bio_analytics"]
router = APIRouter(prefix="/api/v1/link_bio", tags=["link_bio"])


@router.get("/overview")
async def overview(ctx: ProductContext = Depends(require_product(P, "read"))):
    """Real counts of this product's collections. Business rules are pending (documented in PRD)."""
    counts = {c: await db[c].count_documents({"organization_id": ctx.org_id}) for c in COLLECTIONS}
    return {"product_key": P, "implementation_status": "in_development", "counts": counts}
