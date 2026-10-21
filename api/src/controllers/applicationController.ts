import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { hashPassword } from '../utils/password';
import { ROLES, UserRole } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';
import { sendEmail } from '../config/email';
import { logger } from '../config/logger';
import { env } from '../config/env';

export async function submitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const rawName = req.body.applicantName || req.body.name || 'Applicant';
    const applicantName = rawName.trim();
    const email = req.body.email || '';
    const normalizedEmail = email.toLowerCase().trim();
    const password = req.body.password;
    const country = req.body.country || 'Global';
    const organization = req.body.organization || '';
    const experience = req.body.experience || req.body.debateExperience || '';
    const motivation = req.body.motivation || '';
    const areasOfInterest = Array.isArray(req.body.areasOfInterest)
      ? req.body.areasOfInterest
      : (Array.isArray(req.body.interests) ? req.body.interests : ['Global Affairs']);
    const preferredLanguages = req.body.preferredLanguages || ['English'];

    let application = await Application.findOne({ email: normalizedEmail });

    if (application) {
      application.applicantName = applicantName;
      application.country = country;
      application.organization = organization;
      application.experience = experience;
      application.motivation = motivation;
      application.areasOfInterest = areasOfInterest;
      application.preferredLanguages = preferredLanguages;
      if (password) application.password = password;
      application.status = 'pending';
      application.emailVerified = true;
      await application.save();
    } else {
      application = await Application.create({
        applicantName,
        email: normalizedEmail,
        password: password || '',
        country,
        organization,
        experience,
        motivation,
        areasOfInterest,
        preferredLanguages,
        status: 'pending',
        emailVerified: true,
      });
    }

    // Notify applicant that application is under review
    sendEmail({
      to: normalizedEmail,
      subject: 'Application Received — Global Youth Dialogue & Exchange (GYDE)',
      text: `Hello ${applicantName},\n\nThank you for applying to the Global Youth Dialogue & Exchange (GYDE).\n\nYour application has been received and is currently being reviewed by our secretariat. You will receive an official notification email once your application and accreditation have been approved.\n\nBest regards,\nGYDE Secretariat\nhttps://www.thegyde.in`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0E4D3C; margin-top: 0;">Global Youth Dialogue & Exchange</h2>
          <p>Hello <strong>${applicantName}</strong>,</p>
          <p>Thank you for submitting your application to join <strong>GYDE</strong> representing <strong>${country || 'your country'}</strong>.</p>
          <div style="background: #F7FAF9; border-left: 4px solid #0E4D3C; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0E4D3C; font-weight: 600;">Status: Pending Secretariat Review</p>
            <p style="margin: 6px 0 0 0; color: #4b5563; font-size: 14px;">Our administration team is reviewing your profile and credentials. You will receive an official email as soon as your accreditation is approved.</p>
          </div>
          <p style="font-size: 14px; color: #64748b;">If you have any questions or require urgent accreditation for an upcoming session, please reach out to us directly.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">GYDE — Qatar ISDC7 Founded Youth Dialogue Community</p>
        </div>
      `,
    }).catch(err => {
      logger.error({ err, email: normalizedEmail }, 'Failed to send application confirmation email to applicant');
    });

    // Notify administrator of new incoming application
    const adminEmail = env.INITIAL_ADMIN_EMAIL || 'admin@thegyde.in';
    sendEmail({
      to: adminEmail,
      subject: `New Application Received: ${applicantName} (${country})`,
      text: `New GYDE Application Submitted:\n\nName: ${applicantName}\nEmail: ${normalizedEmail}\nCountry: ${country}\nOrganization: ${organization || 'N/A'}\nExperience: ${experience || 'N/A'}\n\nPlease review it in the Admin Portal.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0E4D3C; margin-top: 0;">New GYDE Application</h2>
          <p>A new applicant has registered and submitted their profile for accreditation:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Applicant:</strong></td><td>${applicantName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td>${normalizedEmail}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Country:</strong></td><td>${country}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Organization:</strong></td><td>${organization || 'N/A'}</td></tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://thegyde-admin.pages.dev/applications" style="background: #0E4D3C; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Review in Admin Portal
            </a>
          </p>
        </div>
      `,
    }).catch(err => {
      logger.error({ err }, 'Failed to notify admin of new application');
    });

    return sendSuccess(res, application, 'Application submitted successfully! Our secretariat will review your credentials.', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyApplication(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User required');
    const application = await Application.findOne({ email: req.user.email }).sort({ createdAt: -1 });
    return sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 100;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }
    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reviewedBy', 'name email role');

    return sendSuccess(res, applications, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await Application.findById(req.params.id).populate('reviewedBy', 'name email role');
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    return sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}

export async function reviewApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const rawStatus = (req.body.status || '').toLowerCase();
    const status = rawStatus === 'declined' ? 'rejected' : rawStatus;
    const { reviewNotes, assignRole, isApprovedPresenter } = req.body;
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || '')) as string;
    const lookupEmail = req.body.email ? String(req.body.email).toLowerCase().trim() : null;

    let application: any = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      application = await Application.findById(rawId);
    }
    if (!application && lookupEmail) {
      application = await Application.findOne({ email: lookupEmail });
    }
    if (!application && rawId && rawId.includes('@')) {
      application = await Application.findOne({ email: rawId.toLowerCase().trim() });
    }
    if (!application && (lookupEmail || rawId)) {
      application = await Application.findOne({
        $or: [
          { email: lookupEmail || rawId },
          { applicantName: req.body.applicantName || '' },
        ],
      });
    }

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    application.status = status;
    application.reviewNotes = reviewNotes !== undefined ? reviewNotes : application.reviewNotes;
    if (req.user?._id) {
      application.reviewedBy = req.user._id as any;
    }
    application.reviewedAt = new Date();

    if (status === 'approved') {
      if (assignRole === ROLES.PRESENTER || isApprovedPresenter === true) {
        application.isApprovedPresenter = true;
      }
      if (application.presenterProposal) {
        application.presenterProposal.status = 'approved';
      }
    } else if (status === 'rejected') {
      application.isApprovedPresenter = false;
      if (application.presenterProposal) {
        application.presenterProposal.status = 'rejected';
      }
    }

    await application.save();

    // If approved, create or activate user account with credentials
    if (status === 'approved') {
      let user = await User.findOne({ email: application.email });
      const targetRole: UserRole = assignRole || (application.isApprovedPresenter ? ROLES.PRESENTER : ROLES.MEMBER);

      if (!user) {
        const tempPassword = application.password || 'gydeMember2026!';
        const passwordHash = await hashPassword(tempPassword);
        user = await User.create({
          name: application.applicantName,
          email: application.email,
          passwordHash,
          role: targetRole,
          status: 'active',
          emailVerified: true,
          country: application.country,
          organization: application.organization,
          interests: application.areasOfInterest,
        });
      } else {
        user.role = targetRole;
        user.status = 'active';
        user.emailVerified = true;
        await user.save();
      }

      application.linkedUser = user._id as any;
      await application.save();

      // Dispatch official approval email to applicant
      sendEmail({
        to: application.email,
        subject: 'Accreditation Approved — Welcome to Global Youth Dialogue & Exchange (GYDE)',
        text: `Dear ${application.applicantName},\n\nCongratulations! Your application to join the Global Youth Dialogue & Exchange (GYDE) has been officially reviewed and approved.\n\nYou have been accredited as a: ${targetRole.toUpperCase()}.\n\nYou can now log in to the GYDE portal using your registered email and credentials:\nhttps://www.thegyde.in/login\n\nLogin Email: ${application.email}\nRole: ${targetRole}\n\nWe look forward to your active participation in our upcoming sessions and international debates.\n\nWarm regards,\nGYDE Secretariat\nhttps://www.thegyde.in`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #0E4D3C; margin: 0; font-size: 24px;">Global Youth Dialogue & Exchange</h1>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Official Accreditation & Membership Confirmation</p>
            </div>
            
            <p>Dear <strong>${application.applicantName}</strong>,</p>
            
            <p>We are thrilled to inform you that your membership application representing <strong>${application.country || 'your country'}</strong> has been <strong>approved</strong> by the GYDE Secretariat.</p>
            
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 18px; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">Accreditation Details</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Role:</strong> <span style="background: #DCFCE7; color: #166534; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">${targetRole}</span></p>
              <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Registered Email:</strong> ${application.email}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Status:</strong> Active Member</p>
            </div>

            <p style="font-size: 14px; color: #475569;">
              You can now access your member portal to participate in scheduled sessions, debate motions, and connect with fellow international delegates:
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="https://www.thegyde.in/login" style="background: #0E4D3C; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 15px;">
                Log In to GYDE Portal
              </a>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
              Please sign in using your registered password. If you need any assistance, feel free to reply to this email or contact our support team.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              GYDE — Qatar ISDC7 Founded Youth Dialogue Community<br />
              <a href="https://www.thegyde.in" style="color: #0E4D3C; text-decoration: none;">www.thegyde.in</a>
            </p>
          </div>
        `,
      }).catch(err => {
        logger.error({ err, email: application.email }, 'Failed to send approval email to applicant');
      });
    }

    await logAuditEvent({
      action: `APPLICATION_${status.toUpperCase()}`,
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'application',
      targetId: application._id.toString(),
      details: { status, reviewNotes, assignRole },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, application, `Application updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    await logAuditEvent({
      action: 'APPLICATION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'application',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Application removed successfully');
  } catch (err) {
    next(err);
  }
}

export async function applyForPresenter(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User authentication required');

    const {
      countryChapter,
      sphere,
      proposedTopic,
      experience,
      dossierUrl,
      preferredFormat,
      statementOfIntent,
    } = req.body;

    const normalizedEmail = req.user.email.toLowerCase().trim();

    let application = await Application.findOne({
      $or: [{ linkedUser: req.user._id }, { email: normalizedEmail }],
    });

    const proposalData = {
      countryChapter,
      sphere,
      proposedTopic,
      experience,
      dossierUrl: dossierUrl || '',
      preferredFormat: preferredFormat || '15-min Keynote Briefing (Opening Research)',
      statementOfIntent,
      appliedAt: new Date(),
      status: 'pending' as const,
    };

    if (application) {
      application.presenterProposal = proposalData;
      application.linkedUser = req.user._id;
      await application.save();
    } else {
      application = await Application.create({
        applicantName: req.user.name,
        email: normalizedEmail,
        country: req.user.country || countryChapter,
        organization: req.user.organization || '',
        experience,
        motivation: statementOfIntent,
        areasOfInterest: [sphere],
        preferredLanguages: req.user.languages || ['English'],
        status: 'approved', // Already an approved member
        linkedUser: req.user._id,
        isApprovedPresenter: false,
        presenterProposal: proposalData,
      });
    }

    await logAuditEvent({
      action: 'PRESENTER_APPLICATION_SUBMITTED',
      performedBy: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      targetType: 'application',
      targetId: application._id.toString(),
      details: { proposedTopic, sphere },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(
      res,
      application.presenterProposal,
      'Presenter application submitted successfully. The Coordinator Secretariat will review your credentials.',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function getPresenterStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new BadRequestError('User authentication required');

    const isPresenterRole = ['presenter', 'PRESENTER'].includes(req.user.role as string);

    const application = await Application.findOne({
      $or: [{ linkedUser: req.user._id }, { email: req.user.email.toLowerCase().trim() }],
    });

    return sendSuccess(res, {
      isPresenter: isPresenterRole || Boolean(application?.isApprovedPresenter),
      hasPendingProposal: application?.presenterProposal?.status === 'pending',
      proposal: application?.presenterProposal || null,
    });
  } catch (err) {
    next(err);
  }
}
