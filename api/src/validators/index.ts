import { z } from 'zod';
import { ROLES } from '../constants/roles';

// Auth Validators
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  country: z.string().min(2, 'Country is required'),
  organization: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  name: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  otp: z.string().length(6, 'OTP code must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
});

export const verifyResetCodeSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  code: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Valid email address is required').toLowerCase().trim().optional(),
    code: z.string().optional(),
    token: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100),
  })
  .refine((data) => data.token || (data.email && data.code), {
    message: 'Either reset token or email with 6-digit verification code is required',
  });

// Application Validators
export const createApplicationSchema = z.object({
  applicantName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  country: z.string().optional().or(z.literal('')).transform((v) => v || 'Global'),
  organization: z.string().optional().or(z.literal('')),
  experience: z.string().optional().or(z.literal('')),
  debateExperience: z.string().optional().or(z.literal('')),
  motivation: z.string().optional().or(z.literal('')),
  areasOfInterest: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  preferredLanguages: z.array(z.string()).optional(),
  role: z.string().optional(),
  type: z.string().optional(),
  isApprovedPresenter: z.boolean().optional(),
});

export const reviewApplicationSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'declined']),
  reviewNotes: z.string().optional().or(z.literal('')),
  assignRole: z.enum([ROLES.MEMBER, ROLES.PRESENTER, ROLES.COORDINATOR]).optional(),
  isApprovedPresenter: z.boolean().optional(),
  scope: z.enum(['membership', 'presenter']).optional(),
  targetRole: z.string().optional(),
  email: z.string().optional(),
  applicantName: z.string().optional(),
});

export const presenterApplicationSchema = z.object({
  countryChapter: z.string().optional().or(z.literal('')).transform((v) => v || 'Global Delegation'),
  sphere: z.string().optional().or(z.literal('')).transform((v) => v || 'Geopolitics & International Relations'),
  proposedTopic: z.string().optional().or(z.literal('')).transform((v) => v || 'Keynote Presentation & Academic Briefing'),
  experience: z.string().optional().or(z.literal('')).transform((v) => v || 'Active Member of GYDE Academic Community'),
  dossierUrl: z.string().optional().or(z.literal('')),
  preferredFormat: z.string().optional().or(z.literal('')).transform((v) => v || 'Topic Presentation (Presenter / Keynote)'),
  statementOfIntent: z.string().optional().or(z.literal('')).transform((v) => v || 'Committed to fostering evidence-based dialogue and active participation.'),
});

// Session Validators
export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  titleAr: z.string().optional(),
  description: z.string().optional().or(z.literal('')).transform((v) => v || 'Session agenda and dialogue overview.'),
  descriptionAr: z.string().optional(),
  category: z.string().optional().or(z.literal('')).transform((v) => v || 'General'),
  categoryNameAr: z.string().optional(),
  format: z.string().optional(),
  formatAr: z.string().optional(),
  motion: z.string().optional(),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid ISO date string is required',
  }),
  durationMinutes: z.number().int().positive().default(90),
  timezone: z.string().default('UTC'),
  meetingUrl: z.string().optional().or(z.literal('')),
  recordingUrl: z.string().optional().or(z.literal('')),
  recordingVisibility: z.enum(['public', 'members_only', 'private']).default('members_only'),
  presenters: z
    .array(
      z.object({
        userId: z.string().optional(),
        name: z.string().min(1),
        role: z.string().optional(),
        country: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .default([]),
  propositionTeam: z.array(z.string()).optional(),
  oppositionTeam: z.array(z.string()).optional(),
  moderator: z.string().optional(),
  adjudicator: z.string().optional(),
  discussionQuestions: z.array(z.string()).optional(),
  workingDraftTitle: z.string().optional(),
  summary: z.string().optional(),
  summaryAr: z.string().optional(),
  keyTakeaways: z.array(z.string()).optional(),
  outcomes: z.string().optional(),
  isPresenterProposal: z.boolean().optional(),
  proposalNotes: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  presentationLanguage: z.string().optional(),
  dossierUrl: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'approved', 'live', 'completed', 'cancelled', 'proposed', 'rejected', 'published']).optional(),
  assignedCoordinator: z.string().optional(),
  assignedCoordinatorId: z.string().optional(),
});

export const updateSessionSchema = createSessionSchema.partial().extend({
  status: z.enum(['draft', 'scheduled', 'approved', 'live', 'completed', 'cancelled', 'proposed', 'rejected', 'published']).optional(),
});

// Topic Validators
export const createTopicSchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  titleAr: z.string().optional(),
  description: z.string().optional().or(z.literal('')).transform((v) => v || 'Proposed topic for international youth dialogue.'),
  descriptionAr: z.string().optional(),
  category: z.string().optional().or(z.literal('')).transform((v) => v || 'Geopolitics & International Relations'),
  subtopics: z.array(z.string()).optional(),
  subtopic: z.string().optional(),
  motion: z.string().optional(),
  format: z.string().optional(),
  regionalPerspective: z.string().optional(),
  sources: z.string().optional(),
  isCustom: z.boolean().optional(),
  interestedToPresent: z.boolean().optional(),
  preferredDate: z.string().optional().or(z.date()).optional(),
  preferredTimeSlot: z.string().optional(),
  presentationLanguage: z.string().optional(),
  presentationNotes: z.string().optional(),
  dossierUrl: z.string().optional(),
  status: z.string().optional(),
});

export const updateTopicStatusSchema = z.object({
  status: z.enum(['proposed', 'reviewing', 'shortlisted', 'approved', 'published', 'scheduled', 'completed', 'rejected']).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  motion: z.string().optional(),
  format: z.string().optional(),
  subtopic: z.string().optional(),
  reviewNotes: z.string().optional(),
  assignedCoordinatorId: z.string().optional(),
  relatedSessionId: z.string().optional(),
});

// Feedback Validators
export const submitFeedbackSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  presentationId: z.string().optional(),
  recipientPresenterId: z.string().optional(),
  ratings: z.object({
    argumentation: z.number().min(1).max(5).default(5),
    evidence: z.number().min(1).max(5).default(5),
    delivery: z.number().min(1).max(5).default(5),
    engagement: z.number().min(1).max(5).default(5),
  }),
  strengths: z.string().optional().or(z.literal('')).transform((v) => v || 'Engaging delivery, well-structured arguments, and clear thesis.'),
  improvements: z.string().optional().or(z.literal('')).transform((v) => v || 'Continue expanding cross-regional empirical evidence.'),
  missingPerspectives: z.string().optional(),
  futureTopicSuggestions: z.string().optional(),
  privateNotes: z.string().optional(),
  visibility: z.enum(['presenter_and_staff', 'staff_only', 'public']).default('presenter_and_staff'),
});

// Publication Validators
export const createPublicationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  titleAr: z.string().optional(),
  slug: z.string().optional(),
  abstract: z.string().optional().or(z.literal('')).transform((v) => v || 'Executive abstract and research summary.'),
  abstractAr: z.string().optional(),
  category: z.string().optional().or(z.literal('')).transform((v) => v || 'Geopolitics & International Relations'),
  authors: z
    .array(
      z.object({
        name: z.string().min(1),
        nameAr: z.string().optional(),
        country: z.string().optional().default('Global'),
        role: z.string().optional(),
        affiliation: z.string().optional(),
      })
    )
    .optional(),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        titleAr: z.string().optional(),
        content: z.string().min(1),
        contentAr: z.string().optional(),
      })
    )
    .optional(),
  content: z.string().optional(),
  contentAr: z.string().optional(),
  coverImage: z.string().optional(),
  documentUrl: z.string().optional(),
  citation: z.string().optional(),
  status: z.enum(['draft', 'under_review', 'published', 'archived', 'rejected']).default('draft'),
  visibility: z.enum(['public', 'members_only']).default('public'),
});

export const updatePublicationSchema = createPublicationSchema.partial();
