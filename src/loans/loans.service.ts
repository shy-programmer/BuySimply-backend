import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import loansData from '../data/loans.json';

const loans = loansData as any[];

@Injectable()
export class LoansService {
  private loans = [...loans];

  private filterTotalLoan(loan: any, role: string) {
    if (role !== 'staff') return loan;

    const { totalLoan, ...applicantWithoutTotalLoan } = loan.applicant;

    return {
      ...loan,
      applicant: applicantWithoutTotalLoan,
    };
  }

  getAll(status: string | undefined, role: string) {
    let result = [...this.loans];

    if (status) {
      result = result.filter((loan) => loan.status === status);
    }

    return result.map((loan) => this.filterTotalLoan(loan, role));
  }

  getByEmail(email: string, role: string) {
    const result = this.loans.filter(
      (loan) => loan.applicant.email === email
    );

    return {
      loans: result.map((loan) => this.filterTotalLoan(loan, role)),
    };
  }

  getExpired(role: string) {
    const now = new Date();
    const result = this.loans.filter(
      (loan) => new Date(loan.maturityDate) < now
    );

    return result.map((loan) => this.filterTotalLoan(loan, role));
  }

  delete(loanId: string, role: string) {
    if (role !== 'superAdmin') {
      throw new ForbiddenException('Only superAdmin can delete loans');
    }

    const index = this.loans.findIndex((loan) => loan.id === loanId);

    if (index === -1) {
      throw new NotFoundException(`Loan with id ${loanId} not found`);
    }

    this.loans.splice(index, 1);
    return { message: 'Loan deleted successfully' };
  }
}