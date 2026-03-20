export default function useWhatsApp() {
  const configWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
  };

  const checkoutWhatsApp = (
    whatsappNumber: string,
    productName: string,
    quantity: number,
    totalPrice: number,
    buyerName: string,
    buyerNote?: string
  ) => {
    const message = `🛒 *ORDER BARU*\n\n` +
      `📦 Produk: ${productName}\n` +
      `🔢 Qty: ${quantity}\n` +
      `💰 Total: Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}\n` +
      `👤 Pembeli: ${buyerName}\n` +
      `${buyerNote ? `📝 Catatan: ${buyerNote}\n` : ''}\n` +
      `Mohon diproses, terima kasih!`;

    return configWhatsApp(whatsappNumber, message);
  };

  const cartCheckoutWhatsApp = (
    whatsappNumber: string,
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>,
    totalPrice: number,
    buyerName: string,
    buyerNote?: string
  ) => {
    let productList = '';
    items.forEach((item, index) => {
      productList += `${index + 1}. ${item.name} x${item.quantity} - Rp ${new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}\n`;
    });

    const message = `🛒 *ORDER BARU*\n\n` +
      `📋 *Produk:*\n${productList}\n` +
      `💰 *Total: Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}*\n` +
      `👤 *Pembeli: ${buyerName}*\n` +
      `${buyerNote ? `📝 Catatan: ${buyerNote}\n` : ''}\n` +
      `Mohon diproses, terima kasih!`;

    return configWhatsApp(whatsappNumber, message);
  };

  const openWhatsApp = (url: string) => {
    if (process.client) {
      window.open(url, '_blank');
    }
  };

  return {
    configWhatsApp,
    checkoutWhatsApp,
    cartCheckoutWhatsApp,
    openWhatsApp,
  };
}
