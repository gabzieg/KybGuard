export type SanctionStatus = 'clean' | 'flagged' | 'under_review';

export interface SanctionCheck {
  listName: string; // ex: "OFAC", "Interpol", "PEP"
  status: SanctionStatus;
  lastChecked: string;
  details?: string;
}

export interface KycProfile {
  id: string;
  entityType: 'individual' | 'corporate';
  fullName: string;
  documentId: string; // CPF, CNPJ, SSN, etc.
  countryOfOrigin: string;
  onboardingDate: string;
  
  riskScore: number; // 0 a 100
  riskCategory: 'low' | 'medium' | 'high' | 'unacceptable';
  
  sanctionChecks: SanctionCheck[];
  
  kycStatus: 'approved' | 'pending' | 'rejected' | 'frozen';
  nextReviewDate?: string;
}
