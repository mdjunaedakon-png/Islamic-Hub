export interface BkashConfig {
  baseUrl: string;
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
  callbackURL: string;
}

export function getBkashConfig(): BkashConfig | null {
  const baseUrl = process.env.BKASH_BASE_URL || '';
  const username = process.env.BKASH_USERNAME || '';
  const password = process.env.BKASH_PASSWORD || '';
  const appKey = process.env.BKASH_APP_KEY || '';
  const appSecret = process.env.BKASH_APP_SECRET || '';
  const callbackURL = process.env.BKASH_CALLBACK_URL || '';
  if (!baseUrl || !username || !password || !appKey || !appSecret || !callbackURL) return null;
  return { baseUrl, username, password, appKey, appSecret, callbackURL };
}

export async function fetchAccessToken(cfg: BkashConfig): Promise<string> {
  const res = await fetch(`${cfg.baseUrl}/checkout/token/grant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_key: cfg.appKey, app_secret: cfg.appSecret }),
  });
  if (!res.ok) throw new Error('Failed to get bKash token');
  const data = await res.json();
  return data.id_token;
}

export async function createBkashPayment(cfg: BkashConfig, idToken: string, amount: string, invoiceId: string, payerReference = 'ISLAMIC_HUB'): Promise<{ bkashURL: string; paymentID: string; }>{
  const res = await fetch(`${cfg.baseUrl}/checkout/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: idToken,
      'x-app-key': cfg.appKey,
    },
    body: JSON.stringify({
      mode: '0011',
      payerReference,
      callbackURL: cfg.callbackURL,
      amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: invoiceId,
    }),
  });
  if (!res.ok) throw new Error('Failed to create bKash payment');
  const data = await res.json();
  return { bkashURL: data.bkashURL, paymentID: data.paymentID };
}

