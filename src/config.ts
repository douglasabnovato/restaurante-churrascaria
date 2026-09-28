/* Configuração do app por variáveis VITE_ (o número do WhatsApp deixa de ficar fixo no código) */
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "5532988367667").replace(/\D/g, "")
export const IS_DEV_WHATSAPP = !import.meta.env.VITE_WHATSAPP_NUMBER
/* Fim de config.ts */
