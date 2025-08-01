// /utils/parseTransaction.js

const merchantList = ['Shoprite', 'Jumia', 'Amazon', 'Supermart', 'Zara', 'KFC', 'Domino', 'Uber', 'Bolt'];

const categoryKeywords = {
  food: ['restaurant', 'kfc', 'pizza', 'burger', 'domino', 'meal'],
  transport: ['uber', 'bolt', 'ride', 'taxi', 'transport'],
  shopping: ['zara', 'shop', 'jumia', 'amazon', 'store', 'mall', 'market'],
  groceries: ['milk', 'bread', 'grocery', 'supermart', 'shoprite', 'eggs'],
};

function extractAmount(text) {
  const amountRegex = /([₦$€£]?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
  const matches = text.match(amountRegex);
  if (matches) {
    const cleaned = matches.map(a =>
      parseFloat(a.replace(/[^\d.]/g, ''))
    );
    return Math.max(...cleaned);
  }
  return null;
}

function extractDate(text) {
  const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/;
  const match = text.match(dateRegex);
  return match ? match[0] : null;
}

function detectMerchant(text) {
  const lines = text.split('\n').slice(0, 5).join(' ').toLowerCase();
  for (const merchant of merchantList) {
    if (lines.includes(merchant.toLowerCase())) {
      return merchant;
    }
  }
  return 'Unknown';
}

function classifyCategory(text, merchant) {
  const allText = text.toLowerCase() + ' ' + merchant.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        return category;
      }
    }
  }
  return 'other';
}

// NEW: Extract item name and amount per line
function extractLineItems(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const itemRegex = /^(.+?)\s+[₦$€£]?\s?(\d+(?:,\d{3})*(?:\.\d{2})?)$/i;

  const items = [];

  for (let line of lines) {
    const match = line.match(itemRegex);
    if (match) {
      const name = match[1].trim();
      const price = parseFloat(match[2].replace(/[^\d.]/g, ''));
      items.push({ name, price });
    }
  }

  return items;
}

export default function parseTransaction(text) {
  const amount = extractAmount(text);
  const date = extractDate(text);
  const merchant = detectMerchant(text);
  const category = classifyCategory(text, merchant);
  const items = extractLineItems(text);

  return {
    amount,
    date,
    merchant,
    category,
    items, // <- new!
  };
}
