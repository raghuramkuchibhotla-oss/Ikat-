import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

export async function appendOrderToSheets(order: {
  id: string;
  customer: { name: string; phone?: string | null; email?: string | null };
  items: Array<{ product: { title: string } }>;
  totalAmount: { toString(): string };
  status: string;
}): Promise<string> {
  const row = [
    order.id,
    new Date().toISOString(),
    order.customer.name,
    order.customer.phone ?? order.customer.email ?? "",
    order.items.map((i) => i.product.title).join(", "),
    order.totalAmount.toString(),
    order.status,
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Orders!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  return response.data.updates?.updatedRange ?? "";
}
