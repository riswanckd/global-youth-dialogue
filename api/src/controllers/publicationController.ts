import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Publication } from '../models/Publication';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { ROLES } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function listPublications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    const query: any = {};
    if (!isStaff) {
      if (req.user) {
        // Authenticated users see all published papers + their own submissions
        const authFilter = [
          { status: 'published' },
          { createdBy: req.user._id },
          { 'authors.name': req.user.name },
        ];
        if (status && status !== 'all') {
          query.$and = [{ status }, { $or: authFilter }];
        } else {
          query.$or = authFilter;
        }
      } else {
        // Public unauthenticated visitors see only published papers
        query.status = 'published';
        query.visibility = { $ne: 'members_only' };
      }
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') query.category = category;
    if (search) {
      const searchCond = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { 'authors.name': { $regex: search, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = (query.$and || []).concat([{ $or: query.$or }, { $or: searchCond }]);
        delete query.$or;
      } else {
        query.$or = searchCond;
      }
    }

    const total = await Publication.countDocuments(query);
    const publications = await Publication.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccess(res, publications, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicationBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const rawSlug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
    let publication = null;
    if (mongoose.Types.ObjectId.isValid(rawSlug)) {
      publication = await Publication.findById(rawSlug);
    }
    if (!publication) {
      publication = await Publication.findOne({ slug: rawSlug });
    }
    if (!publication) {
      publication = await Publication.findOne({
        $or: [
          { slug: { $regex: `^${rawSlug}$`, $options: 'i' } },
          { title: { $regex: rawSlug.replace(/-/g, ' '), $options: 'i' } },
        ],
      });
    }
    if (!publication) throw new NotFoundError('Publication not found');

    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    if (!isStaff && publication.status !== 'published') {
      throw new NotFoundError('Publication is currently under review or draft');
    }

    if (!req.user && publication.visibility === 'members_only') {
      throw new BadRequestError('This publication is accessible to verified community members only. Please log in.');
    }

    return sendSuccess(res, publication);
  } catch (err) {
    next(err);
  }
}

export async function createPublication(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, titleAr, slug: customSlug, abstract, abstractAr, sections, content, contentAr, authors, category, coverImage, documentUrl, citation, status, visibility } = req.body;

    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!baseSlug) baseSlug = `paper-${Date.now()}`;

    let slug = baseSlug;
    let counter = 1;
    while (await Publication.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    if (req.user?.role === ROLES.MEMBER) {
      throw new ForbiddenError('Members have read-only access to published articles. Only accredited Presenters can draft and submit articles for admin approval.');
    }

    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;
    // Non-staff presenters submit academic work for admin review; admins can publish directly or save draft
    const publicationStatus = isStaff ? (status || 'published') : 'under_review';

    const authorList = authors && authors.length > 0 ? authors : [
      {
        name: req.user!.name,
        country: (req.user as any).country || 'Global',
        role: req.user!.role === ROLES.PRESENTER ? 'Keynote Presenter' : 'GYDE Scholar',
        affiliation: (req.user as any).organization || 'Global Youth Dialogue Secretariat',
      }
    ];

    const publication = await Publication.create({
      title,
      titleAr: titleAr || '',
      slug,
      abstract,
      abstractAr: abstractAr || '',
      sections: sections || [],
      content: content || '',
      contentAr: contentAr || '',
      authors: authorList,
      category,
      coverImage: coverImage || '',
      documentUrl: documentUrl || '',
      citation: citation || '',
      status: publicationStatus,
      visibility: visibility || 'public',
      publishedAt: publicationStatus === 'published' ? new Date() : undefined,
      createdBy: req.user!._id,
    });

    await logAuditEvent({
      action: 'PUBLICATION_CREATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: publication._id.toString(),
      details: { title: publication.title, slug: publication.slug, status: publication.status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, publication, 'Academic research paper created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePublication(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    let publication = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      publication = await Publication.findById(rawId);
    }
    if (!publication) {
      publication = await Publication.findOne({ slug: rawId });
    }
    if (!publication && req.body.title) {
      publication = await Publication.findOne({ title: req.body.title });
    }
    if (!publication) throw new NotFoundError('Publication not found');

    if (req.body.status === 'published') {
      if (!publication.publishedAt) {
        publication.publishedAt = new Date();
      }
    } else if (req.body.status === 'rejected') {
      publication.publishedAt = undefined;
    }

    Object.assign(publication, req.body);
    if (req.body.status === 'published' && (!publication.visibility || (publication.visibility as string) === 'private')) {
      publication.visibility = 'public';
    }
    await publication.save();

    await logAuditEvent({
      action: 'PUBLICATION_UPDATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: publication._id.toString(),
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, publication, 'Publication updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deletePublication(req: Request, res: Response, next: NextFunction) {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) throw new NotFoundError('Publication not found');

    await logAuditEvent({
      action: 'PUBLICATION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Publication deleted successfully');
  } catch (err) {
    next(err);
  }
}
