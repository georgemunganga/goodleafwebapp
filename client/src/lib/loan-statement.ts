import type * as Types from "./api-types";

type StatementPayment = Pick<Types.PaymentHistory, "id" | "amount" | "status" | "date" | "reference" | "description">;

const formatCurrency = (value?: number | null) => {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `K${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function downloadLoanStatement({
  loan,
  schedule = [],
  payments = [],
}: {
  loan: Types.LoanDetails;
  schedule?: Types.RepaymentSchedule[];
  payments?: StatementPayment[];
}) {
  const title = `Loan Statement - ${loan.loanId}`;
  const paymentRows = payments.length
    ? payments
        .map(
          (payment) => `
            <tr>
              <td>${escapeHtml(formatDate(payment.date))}</td>
              <td>${escapeHtml(payment.description || "Loan payment")}</td>
              <td>${escapeHtml(payment.reference || "-")}</td>
              <td>${escapeHtml(payment.status)}</td>
              <td>${escapeHtml(formatCurrency(payment.amount))}</td>
            </tr>`,
        )
        .join("")
    : `<tr><td colspan="5">No payment history available.</td></tr>`;

  const scheduleRows = schedule.length
    ? schedule
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(formatDate(item.dueDate))}</td>
              <td>${escapeHtml(formatCurrency(item.amount))}</td>
              <td>${escapeHtml(item.status)}</td>
            </tr>`,
        )
        .join("")
    : `<tr><td colspan="3">No repayment schedule available.</td></tr>`;

  const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1f2937; margin: 32px; }
      h1, h2 { margin-bottom: 8px; }
      .meta { margin-bottom: 24px; color: #4b5563; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; }
      .label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
      .value { font-size: 16px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th, td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 14px; }
      th { background: #f9fafb; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">Generated on ${escapeHtml(formatDate(new Date().toISOString()))}</p>

    <div class="grid">
      <div class="card"><div class="label">Loan ID</div><div class="value">${escapeHtml(loan.loanId)}</div></div>
      <div class="card"><div class="label">Status</div><div class="value">${escapeHtml(loan.status)}</div></div>
      <div class="card"><div class="label">Loan Amount</div><div class="value">${escapeHtml(formatCurrency(loan.loanAmount))}</div></div>
      <div class="card"><div class="label">Outstanding</div><div class="value">${escapeHtml(formatCurrency(loan.amountRemaining))}</div></div>
      <div class="card"><div class="label">Monthly Payment</div><div class="value">${escapeHtml(formatCurrency(loan.monthlyPayment))}</div></div>
      <div class="card"><div class="label">Total Repayment</div><div class="value">${escapeHtml(formatCurrency(loan.totalRepayment))}</div></div>
    </div>

    <h2>Repayment Schedule</h2>
    <table>
      <thead>
        <tr>
          <th>Due Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${scheduleRows}</tbody>
    </table>

    <h2>Payment History</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Reference</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${paymentRows}</tbody>
    </table>
  </body>
</html>`;

  downloadFile(`${loan.loanId}-statement.html`, content, "text/html;charset=utf-8");
}
