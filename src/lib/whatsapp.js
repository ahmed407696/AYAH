import { WHATSAPP_NUMBER, STORE_NAME } from './constants'
import { formatPrice } from './format'

export function orderMessage(product, currency = '$') {
  return [
    `Hello ${STORE_NAME}! I'd like to order:`,
    '',
    `🛒 Product: ${product.name}`,
    `💰 Price: ${formatPrice(product.price, currency)}`,
    `📦 Item ID: #${product.id}`,
    '',
    'Please confirm availability and delivery details. Thank you!'
  ].join('\n')
}

export function chatMessage() {
  return `Hello ${STORE_NAME}! I have a question about your products.`
}

export function buildWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function openWhatsApp(text) {
  window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
}
