import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = [
  { q: "Quem pode acessar este painel?", a: "Somente membros da organização com permissão neste produto e com assinatura ativa. A verificação é feita no servidor em cada requisição." },
  { q: "Como convido alguém da minha equipe?", a: "Proprietários e administradores com MFA ativo podem enviar convites na página Equipe do produto." },
  { q: "Por que preciso de MFA?", a: "Ações administrativas (equipe, funil e assinatura) exigem autenticação em dois fatores para proteger sua organização." },
  { q: "Contratei outro produto. Onde acesso?", a: "Cada produto tem seu próprio endereço e painel. Acesse a área Minha conta no site para ver os endereços dos produtos contratados." },
  { q: "Como cancelo minha assinatura?", a: "O proprietário pode cancelar na página Assinatura. O acesso permanece até o fim do período já pago." },
];

export const HelpSection = (_: { productKey: string }) => (
  <div className="grid w-full gap-6 xl:grid-cols-3">
    <div className="rounded-xl border border-border bg-card p-6 xl:col-span-2" data-testid="help-faq">
      <h2 className="font-display text-base font-bold">Perguntas frequentes</h2>
      <Accordion type="single" collapsible className="mt-2">
        {FAQ.map((f, i) => (
          <AccordionItem key={f.q} value={`f${i}`}>
            <AccordionTrigger data-testid={`help-faq-${i}`}>{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    <div className="space-y-3 rounded-xl border border-border bg-card p-6" data-testid="help-contact">
      <h2 className="font-display text-base font-bold">Fale com o suporte</h2>
      <p className="text-sm text-muted-foreground">Envie sua dúvida informando a organização e o produto.</p>
      <a href="mailto:suporte@leamse.com" className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline" data-testid="help-email-link">suporte@leamse.com</a>
    </div>
  </div>
);
