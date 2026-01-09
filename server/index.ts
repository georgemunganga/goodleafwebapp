import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const round2 = (value: number) => Math.round(value * 100) / 100;
const toISODate = (value: Date) => value.toISOString().split("T")[0];

const addMonths = (value: Date, months: number) => {
  const next = new Date(value);
  next.setMonth(next.getMonth() + months);
  return next;
};

const normalizePhone = (value?: string) => (value || "").replace(/\D/g, "");

const getInterestRate = (creditScore?: number) => {
  if (!creditScore) return 10.5;
  if (creditScore >= 750) return 6.5;
  if (creditScore >= 700) return 7.5;
  if (creditScore >= 650) return 8.5;
  if (creditScore >= 600) return 10.5;
  return 12.5;
};

const calculateEMI = (principal: number, annualRate: number, months: number) => {
  if (months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return round2(principal / months);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return round2(emi);
};

const calculateLoanTerms = (principal: number, annualRate: number, months: number) => {
  const emi = calculateEMI(principal, annualRate, months);
  const totalPayment = round2(emi * months);
  const totalInterest = round2(totalPayment - principal);
  return { emi, totalPayment, totalInterest };
};

const calculateProgress = (totalRepayment: number, outstanding: number) => {
  if (totalRepayment <= 0) return 0;
  const paid = Math.max(0, totalRepayment - outstanding);
  return Math.min(100, Math.round((paid / totalRepayment) * 100));
};

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+260971234567",
    password: "1234",
    balance: 50000,
    address: "Lusaka, Zambia",
    income: 12000,
    expenses: 4500,
    creditScore: 710,
    existingDebt: 500,
    employmentYears: 5,
  },
];

const buildLoan = (seed: {
  id: number;
  userId: number;
  type: string;
  amount: number;
  status: string;
  date: string;
  tenure: number;
  interestRate?: number;
  paidMonths?: number;
}) => {
  const paidMonths = seed.paidMonths ?? 0;
  const interestRate = seed.interestRate ?? getInterestRate(users[0].creditScore);
  const terms = calculateLoanTerms(seed.amount, interestRate, seed.tenure);
  const totalRepayment = terms.totalPayment;
  const amountDue = terms.emi;
  const outstanding =
    seed.status === "paid" || seed.status === "repaid"
      ? 0
      : round2(Math.max(0, totalRepayment - amountDue * paidMonths));
  const progress = calculateProgress(totalRepayment, outstanding);
  const remainingMonths =
    seed.status === "paid" || seed.status === "repaid"
      ? 0
      : Math.max(0, seed.tenure - paidMonths);
  const nextPayment =
    seed.status === "paid" || seed.status === "repaid"
      ? undefined
      : toISODate(addMonths(new Date(seed.date), paidMonths + 1));
  const disbursed = round2(seed.amount * 0.95);

  return {
    id: seed.id,
    userId: seed.userId,
    type: seed.type,
    amount: seed.amount,
    status: seed.status,
    date: seed.date,
    tenure: seed.tenure,
    interestRate,
    amountDue,
    totalRepayment,
    disbursed,
    outstanding,
    progress,
    remainingMonths,
    nextPayment,
  };
};

const loanSeeds = [
  {
    id: 1,
    userId: 1,
    type: "Personal Loan",
    amount: 10000,
    status: "active",
    date: "2024-10-05",
    tenure: 12,
    interestRate: 9.5,
    paidMonths: 2,
  },
  {
    id: 2,
    userId: 1,
    type: "Business Loan",
    amount: 5000,
    status: "paid",
    date: "2024-04-15",
    tenure: 6,
    interestRate: 8.5,
    paidMonths: 6,
  },
  {
    id: 3,
    userId: 1,
    type: "Personal Loan",
    amount: 50000,
    status: "active",
    date: "2024-06-10",
    tenure: 24,
    interestRate: 7.5,
    paidMonths: 5,
  },
];

let loans = loanSeeds.map(buildLoan);

let repayments: Array<{
  id: number;
  loanId: number;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
}> = [];

let nextRepaymentId = 1;

const generateRepaymentsForLoan = (loan: any, count: number) => {
  const startDate = new Date(loan.date);
  for (let i = 0; i < count; i += 1) {
    repayments.push({
      id: nextRepaymentId++,
      loanId: Number(loan.id),
      amount: loan.amountDue,
      date: toISODate(addMonths(startDate, i + 1)),
      status: "completed",
    });
  }
};

loanSeeds.forEach((seed) => {
  const loan = loans.find((item) => item.id === seed.id);
  if (loan && seed.paidMonths) {
    generateRepaymentsForLoan(loan, seed.paidMonths);
  }
});

const getUser = () => users[0];
const sanitizeUser = (user: typeof users[number]) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const getLoanSchedule = (loan: any) => {
  const tenure = loan.tenure ?? 12;
  const amountDue = loan.amountDue ?? round2((loan.totalRepayment ?? loan.amount) / tenure);
  const startDate = new Date(loan.date ?? new Date());
  const firstDueDate = addMonths(startDate, 1);
  const paidCount = repayments.filter(
    (repayment) => repayment.loanId === Number(loan.id) && repayment.status === "completed"
  ).length;

  const schedule = [];
  const isPaid = loan.status === "paid" || loan.status === "repaid" || loan.outstanding <= 0;

  for (let i = 0; i < tenure; i += 1) {
    let status: "paid" | "due" | "upcoming" = "upcoming";
    if (isPaid || i < paidCount) {
      status = "paid";
    } else if (i === paidCount) {
      status = "due";
    }

    schedule.push({
      date: toISODate(addMonths(firstDueDate, i)),
      amount: amountDue,
      status,
    });
  }

  return schedule;
};

app.post("/api/auth/login", (req, res) => {
  const { email, phone, password } = req.body;
  const normalizedPhone = normalizePhone(phone);

  const user = users.find((item) => {
    if (email && item.email === email) {
      return true;
    }
    if (normalizedPhone && normalizePhone(item.phone) === normalizedPhone) {
      return true;
    }
    return false;
  });

  if (user && password) {
    res.json({
      success: true,
      user: sanitizeUser(user),
      token: `mock-jwt-token-for-${user.id}`,
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, name, phone } = req.body;
  const existingUser = users.find(
    (item) => item.email === email || (phone && normalizePhone(item.phone) === normalizePhone(phone))
  );
  if (existingUser) {
    res.status(400).json({ success: false, message: "User already exists" });
    return;
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    phone: phone || "",
    balance: 0,
    address: "",
    income: 0,
    expenses: 0,
    creditScore: 650,
    existingDebt: 0,
    employmentYears: 0,
  };

  users.push(newUser);
  res.json({
    success: true,
    message: "User registered successfully",
    user: sanitizeUser(newUser),
  });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/me", (_req, res) => {
  const user = getUser();
  res.json(sanitizeUser(user));
});

app.get("/api/loans", (_req, res) => {
  const user = getUser();
  const userLoans = loans.filter((loan) => loan.userId === user.id);
  res.json(userLoans);
});

app.post("/api/loans", (req, res) => {
  const user = getUser();
  const { type, amount, tenure, interestRate, amountDue, totalRepayment, purpose } = req.body;
  const loanTenure = Number(tenure) || 12;
  const rate = Number(interestRate) || getInterestRate(user.creditScore);
  const terms = calculateLoanTerms(Number(amount), rate, loanTenure);
  const today = new Date();

  const newLoan = {
    id: loans.length + 1,
    userId: user.id,
    type,
    amount: Number(amount),
    status: "pending",
    date: toISODate(today),
    tenure: loanTenure,
    interestRate: rate,
    amountDue: Number(amountDue) || terms.emi,
    totalRepayment: Number(totalRepayment) || terms.totalPayment,
    disbursed: round2(Number(amount) * 0.95),
    outstanding: Number(totalRepayment) || terms.totalPayment,
    progress: 0,
    remainingMonths: loanTenure,
    nextPayment: toISODate(addMonths(today, 1)),
    purpose,
  };

  loans.push(newLoan);
  res.status(201).json(newLoan);
});

app.get("/api/loans/:id", (req, res) => {
  const loanId = Number(req.params.id);
  const loan = loans.find((item) => Number(item.id) === loanId);
  if (!loan) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }
  res.json(loan);
});

app.get("/api/loans/:id/schedule", (req, res) => {
  const loanId = Number(req.params.id);
  const loan = loans.find((item) => Number(item.id) === loanId);
  if (!loan) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }
  res.json(getLoanSchedule(loan));
});

app.put("/api/loans/:id", (req, res) => {
  const loanId = Number(req.params.id);
  const loanIndex = loans.findIndex((loan) => Number(loan.id) === loanId);

  if (loanIndex === -1) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }

  loans[loanIndex] = { ...loans[loanIndex], ...req.body };
  res.json(loans[loanIndex]);
});

app.delete("/api/loans/:id", (req, res) => {
  const loanId = Number(req.params.id);
  const loanIndex = loans.findIndex((loan) => Number(loan.id) === loanId);

  if (loanIndex === -1) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }

  loans.splice(loanIndex, 1);
  res.json({ success: true, message: "Loan deleted" });
});

app.get("/api/users/profile", (_req, res) => {
  const user = getUser();
  res.json(sanitizeUser(user));
});

app.put("/api/users/profile", (req, res) => {
  const user = getUser();
  Object.assign(user, req.body);
  res.json({ success: true, message: "Profile updated successfully", user: sanitizeUser(user) });
});

app.post("/api/eligibility/check", (req, res) => {
  const { income = 0, expenses = 0, creditScore = 600, existingDebt = 0 } = req.body;
  const totalObligations = Number(expenses) + Number(existingDebt);
  const dti = income > 0 ? totalObligations / Number(income) : 1;
  const eligible = Number(income) > 0 && dti <= 0.45 && Number(creditScore) >= 600;
  const interestRate = getInterestRate(Number(creditScore));
  const maxAmount = eligible ? Math.min(Number(income) * 12 * 1.2, 200000) : 0;

  res.json({
    eligible,
    maxAmount: round2(maxAmount),
    interestRate,
    message: eligible
      ? "Congratulations! You are eligible for a loan."
      : "Based on the information provided, you are not eligible for a loan at this time.",
    recommendedAmount: eligible ? round2(maxAmount * 0.7) : 0,
    tenureOptions: Number(creditScore) >= 700 ? [6, 12, 18, 24, 36] : [6, 12, 18, 24],
  });
});

app.post("/api/eligibility/terms", (req, res) => {
  const {
    requestedAmount,
    tenureMonths,
    eligibilityData,
    creditScore,
  } = req.body;

  const credit = Number(eligibilityData?.creditScore ?? creditScore ?? getUser().creditScore);
  const rate = getInterestRate(credit);
  const principal = Number(requestedAmount) || 0;
  const months = Number(tenureMonths) || 12;
  const terms = calculateLoanTerms(principal, rate, months);

  res.json({
    interestRate: rate,
    emi: terms.emi,
    totalInterest: terms.totalInterest,
    totalPayment: terms.totalPayment,
    tenureMonths: months,
  });
});

app.get("/api/kyc/status", (_req, res) => {
  res.json({
    status: "pending",
    message: "KYC verification in progress",
    steps: [
      { step: "identity", status: "completed" },
      { step: "address", status: "pending" },
      { step: "income", status: "pending" },
    ],
  });
});

app.post("/api/kyc", (_req, res) => {
  const user = getUser();
  const pendingLoan = loans
    .filter((loan) => loan.userId === user.id && loan.status === "pending")
    .sort((a, b) => Number(b.id) - Number(a.id))[0];

  if (pendingLoan) {
    pendingLoan.status = "active";
    pendingLoan.nextPayment = pendingLoan.nextPayment || toISODate(addMonths(new Date(), 1));
  }

  res.json({ success: true, message: "KYC submitted successfully" });
});

app.get("/api/repayments", (_req, res) => {
  const user = getUser();
  const userLoanIds = new Set(loans.filter((loan) => loan.userId === user.id).map((loan) => Number(loan.id)));
  const userRepayments = repayments
    .filter((repayment) => userLoanIds.has(Number(repayment.loanId)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  res.json(userRepayments);
});

app.get("/api/repayments/bank-details", (_req, res) => {
  res.json({
    bankName: "Zambia National Commercial Bank",
    accountName: "Goodleaf Loans Ltd",
    accountNumber: "1234567890",
    branchCode: "001",
  });
});

app.post("/api/repayments", (req, res) => {
  const { loanId, amount } = req.body;
  const normalizedLoanId = Number.isNaN(Number(loanId)) ? loanId : Number(loanId);
  const loan = loans.find((item) => Number(item.id) === Number(normalizedLoanId));

  if (!loan) {
    res.status(404).json({ error: "Loan not found" });
    return;
  }

  const newRepayment = {
    id: nextRepaymentId++,
    loanId: Number(normalizedLoanId),
    amount: round2(Number(amount)),
    date: toISODate(new Date()),
    status: "completed" as const,
  };

  repayments.push(newRepayment);

  const totalRepayment = loan.totalRepayment ?? loan.amount;
  const currentOutstanding = loan.outstanding ?? totalRepayment;
  const nextOutstanding = round2(Math.max(0, currentOutstanding - Number(amount)));
  const paidCount = repayments.filter(
    (repayment) => repayment.loanId === Number(loan.id) && repayment.status === "completed"
  ).length;

  loan.outstanding = nextOutstanding;
  loan.progress = calculateProgress(totalRepayment, nextOutstanding);
  loan.remainingMonths = Math.max(0, (loan.tenure ?? paidCount) - paidCount);

  if (nextOutstanding <= 0 || loan.remainingMonths === 0) {
    loan.status = "paid";
    loan.nextPayment = undefined;
  } else {
    loan.nextPayment = toISODate(addMonths(new Date(loan.date), paidCount + 1));
  }

  res.status(201).json(newRepayment);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const port = process.env.PORT || 3001;

const server = createServer(app);
server.listen(port, () => {
  console.log(`REST API Server running on http://localhost:${port}/`);
  console.log(`API endpoints available at http://localhost:${port}/api/health`);
});

export default server;
