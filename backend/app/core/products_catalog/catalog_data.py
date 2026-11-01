SEGMENTS = {
    "agro": "Agro",
    "educacao": "Educação",
    "hotelaria": "Hotelaria",
    "juridico": "Jurídico",
    "logistica": "Logística",
    "servicos": "Prestação de Serviços",
    "saude": "Saúde",
    "comercio": "Comércios Gerais",
}

PRODUCTS = [
    {"key": "crm", "slug": "crm", "name": "CRM de Vendas", "status": "available",
     "tagline": "Leads, funil e oportunidades com o processo comercial do seu mercado.",
     "features": ["Leads com campos do segmento", "Funil de oportunidades", "Contatos", "Agenda de atividades",
                  "Equipe com papéis e permissões", "Histórico auditável"],
     "supported_segments": list(SEGMENTS.keys())},
    {"key": "erp", "slug": "erp", "name": "ERP", "status": "in_development",
     "tagline": "Produtos, estoque, compras, vendas e notas em um só sistema.",
     "features": ["Cadastro de produtos", "Estoque", "Compras", "Vendas", "Notas fiscais"], "supported_segments": []},
    {"key": "email_api", "slug": "email-api", "name": "Email API", "status": "in_development",
     "tagline": "Envio transacional com domínios verificados, templates e eventos.",
     "features": ["Domínios", "Templates", "Chaves de API", "Eventos de entrega"], "supported_segments": []},
    {"key": "payments_api", "slug": "payments-api", "name": "Payments API", "status": "in_development",
     "tagline": "Orquestração de pagamentos via parceiros autorizados.",
     "features": ["Intenções de pagamento", "Transações", "Reembolsos", "Webhooks"], "supported_segments": []},
    {"key": "marketplace", "slug": "marketplace", "name": "Marketplace API", "status": "in_development",
     "tagline": "Vendedores, catálogo e pedidos para o seu marketplace.",
     "features": ["Vendedores", "Produtos", "Pedidos"], "supported_segments": []},
    {"key": "recebimento", "slug": "recebimento", "name": "Recebimento", "status": "in_development",
     "tagline": "Contas a receber, cobrança e conciliação de pagamentos.",
     "features": ["Recebíveis", "Régua de cobrança", "Baixas"], "supported_segments": []},
    {"key": "marketing", "slug": "marketing", "name": "Marketing Digital", "status": "in_development",
     "tagline": "Campanhas, contatos, automações e métricas.",
     "features": ["Campanhas", "Contatos", "Automações", "Métricas"], "supported_segments": []},
    {"key": "chatbot", "slug": "chatbot", "name": "Atendimento Chatbot", "status": "in_development",
     "tagline": "Bots, canais e conversas de atendimento.",
     "features": ["Bots", "Canais", "Conversas"], "supported_segments": []},
    {"key": "link_bio", "slug": "link-bio", "name": "Link na Bio", "status": "in_development",
     "tagline": "Páginas de links com temas e analytics.",
     "features": ["Páginas", "Links", "Temas", "Analytics"], "supported_segments": []},
]

# Placeholder prices (BRL, monthly) — editable here; Stripe prices are synced by scripts/setup_stripe.py
PLANS = [
    {"product_key": "crm", "plan_key": "starter", "name": "Starter", "price_cents": 9900, "currency": "brl",
     "interval": "month", "seats": 3, "highlights": ["Até 3 usuários", "Leads e contatos ilimitados", "1 funil"]},
    {"product_key": "crm", "plan_key": "pro", "name": "Pro", "price_cents": 24900, "currency": "brl",
     "interval": "month", "seats": 10, "highlights": ["Até 10 usuários", "Funil personalizável", "Auditoria completa"]},
    {"product_key": "crm", "plan_key": "business", "name": "Business", "price_cents": 59900, "currency": "brl",
     "interval": "month", "seats": 50, "highlights": ["Até 50 usuários", "Papéis avançados", "Suporte prioritário"]},
]


def lookup_key(product_key: str, plan_key: str) -> str:
    return f"{product_key}_{plan_key}_monthly"


PRODUCT_KEYS = {p["key"] for p in PRODUCTS}
