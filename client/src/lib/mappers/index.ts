/**
 * Data Transfer Object (DTO) Mappers
 * 
 * Maps between API responses (DTOs) and UI models
 * Centralizes backend quirk handling, versioning, and data transformations
 */

export interface Mapper<DTO, Model> {
  toModel(dto: DTO): Model;
  toDTO(model: Model): DTO;
  toDTOPartial(model: Partial<Model>): Partial<DTO>;
}

/**
 * Base Mapper class
 */
export abstract class BaseMapper<DTO, Model> implements Mapper<DTO, Model> {
  abstract toModel(dto: DTO): Model;
  abstract toDTO(model: Model): DTO;
  abstract toDTOPartial(model: Partial<Model>): Partial<DTO>;

  mapArray(dtos: DTO[]): Model[] {
    return dtos.map((dto) => this.toModel(dto));
  }

  mapArrayToDTO(models: Model[]): DTO[] {
    return models.map((model) => this.toDTO(model));
  }
}

/**
 * User DTO and Model
 */
export interface UserDTO {
  id: string;
  phone_number?: string;
  email?: string;
  full_name: string;
  status: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
}

export interface UserModel {
  id: string;
  phoneNumber?: string;
  email?: string;
  fullName: string;
  status: string;
  kycStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserMapper extends BaseMapper<UserDTO, UserModel> {
  toModel(dto: UserDTO): UserModel {
    return {
      id: dto.id,
      phoneNumber: dto.phone_number,
      email: dto.email,
      fullName: dto.full_name,
      status: dto.status,
      kycStatus: dto.kyc_status,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  toDTO(model: UserModel): UserDTO {
    return {
      id: model.id,
      phone_number: model.phoneNumber,
      email: model.email,
      full_name: model.fullName,
      status: model.status,
      kyc_status: model.kycStatus,
      created_at: model.createdAt.toISOString(),
      updated_at: model.updatedAt.toISOString(),
    };
  }

  toDTOPartial(model: Partial<UserModel>): Partial<UserDTO> {
    return {
      id: model.id,
      phone_number: model.phoneNumber,
      email: model.email,
      full_name: model.fullName,
      status: model.status,
      kyc_status: model.kycStatus,
    };
  }
}

/**
 * Loan DTO and Model
 */
export interface LoanDTO {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  term_months: number;
  interest_rate: number;
  status: string;
  disbursed_date?: string;
  due_date?: string;
  outstanding_amount: number;
  next_payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface LoanModel {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  termMonths: number;
  interestRate: number;
  status: string;
  disbursedDate?: Date;
  dueDate?: Date;
  outstandingAmount: number;
  nextPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class LoanMapper extends BaseMapper<LoanDTO, LoanModel> {
  toModel(dto: LoanDTO): LoanModel {
    return {
      id: dto.id,
      userId: dto.user_id,
      productId: dto.product_id,
      amount: dto.amount,
      termMonths: dto.term_months,
      interestRate: dto.interest_rate,
      status: dto.status,
      disbursedDate: dto.disbursed_date ? new Date(dto.disbursed_date) : undefined,
      dueDate: dto.due_date ? new Date(dto.due_date) : undefined,
      outstandingAmount: dto.outstanding_amount,
      nextPaymentDate: dto.next_payment_date ? new Date(dto.next_payment_date) : undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  toDTO(model: LoanModel): LoanDTO {
    return {
      id: model.id,
      user_id: model.userId,
      product_id: model.productId,
      amount: model.amount,
      term_months: model.termMonths,
      interest_rate: model.interestRate,
      status: model.status,
      disbursed_date: model.disbursedDate?.toISOString(),
      due_date: model.dueDate?.toISOString(),
      outstanding_amount: model.outstandingAmount,
      next_payment_date: model.nextPaymentDate?.toISOString(),
      created_at: model.createdAt.toISOString(),
      updated_at: model.updatedAt.toISOString(),
    };
  }

  toDTOPartial(model: Partial<LoanModel>): Partial<LoanDTO> {
    return {
      id: model.id,
      user_id: model.userId,
      product_id: model.productId,
      amount: model.amount,
      term_months: model.termMonths,
      interest_rate: model.interestRate,
      status: model.status,
    };
  }
}

/**
 * Repayment DTO and Model
 */
export interface RepaymentDTO {
  id: string;
  loan_id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface RepaymentModel {
  id: string;
  loanId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RepaymentMapper extends BaseMapper<RepaymentDTO, RepaymentModel> {
  toModel(dto: RepaymentDTO): RepaymentModel {
    return {
      id: dto.id,
      loanId: dto.loan_id,
      amount: dto.amount,
      dueDate: new Date(dto.due_date),
      paidDate: dto.paid_date ? new Date(dto.paid_date) : undefined,
      status: dto.status,
      paymentMethod: dto.payment_method,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  toDTO(model: RepaymentModel): RepaymentDTO {
    return {
      id: model.id,
      loan_id: model.loanId,
      amount: model.amount,
      due_date: model.dueDate.toISOString(),
      paid_date: model.paidDate?.toISOString(),
      status: model.status,
      payment_method: model.paymentMethod,
      created_at: model.createdAt.toISOString(),
      updated_at: model.updatedAt.toISOString(),
    };
  }

  toDTOPartial(model: Partial<RepaymentModel>): Partial<RepaymentDTO> {
    return {
      id: model.id,
      loan_id: model.loanId,
      amount: model.amount,
      status: model.status,
      payment_method: model.paymentMethod,
    };
  }
}

/**
 * KYC DTO and Model
 */
export interface KycDTO {
  id: string;
  user_id: string;
  status: string;
  document_type: string;
  document_number: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface KycModel {
  id: string;
  userId: string;
  status: string;
  documentType: string;
  documentNumber: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class KycMapper extends BaseMapper<KycDTO, KycModel> {
  toModel(dto: KycDTO): KycModel {
    return {
      id: dto.id,
      userId: dto.user_id,
      status: dto.status,
      documentType: dto.document_type,
      documentNumber: dto.document_number,
      verifiedAt: dto.verified_at ? new Date(dto.verified_at) : undefined,
      rejectionReason: dto.rejection_reason,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  toDTO(model: KycModel): KycDTO {
    return {
      id: model.id,
      user_id: model.userId,
      status: model.status,
      document_type: model.documentType,
      document_number: model.documentNumber,
      verified_at: model.verifiedAt?.toISOString(),
      rejection_reason: model.rejectionReason,
      created_at: model.createdAt.toISOString(),
      updated_at: model.updatedAt.toISOString(),
    };
  }

  toDTOPartial(model: Partial<KycModel>): Partial<KycDTO> {
    return {
      id: model.id,
      user_id: model.userId,
      status: model.status,
      document_type: model.documentType,
      document_number: model.documentNumber,
    };
  }
}

/**
 * Global mapper instances
 */
export const userMapper = new UserMapper();
export const loanMapper = new LoanMapper();
export const repaymentMapper = new RepaymentMapper();
export const kycMapper = new KycMapper();
