import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { hashPassword } from '../utils/password';
import { ROLES, UserRole } from '../constants/roles';
import { logger } from '../config/logger';

const RAW_USERS = [
  {
    id: "app_mv6vqybh",
    name: "Atheer Kamal",
    email: "atheerkamal680@gmail.com",
    password: "Atheer155",
    country: "Sudan",
    flag: "INT",
    interests: ["Global Affairs"],
    debateExperience: "I am a Sudanese debater, Best Speaker in the Sudan School Debates 2025 and Second Best Speaker in 2023. I represented Sudan at the 7th International Schools Debating Championship in Qatar",
    motivation: "I want to join GYD to exchange ideas with young people worldwide, broaden my global perspective, and contribute to meaningful discussions and academic writing on international issues",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6qz5k5",
    name: "Bayan El Kurdi",
    email: "kurdib523@gmail.com",
    password: "M3vU.m43XC:Wahq",
    country: "Lebanon",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Education & Knowledge",
      "Environment & Climate",
      "Governance & Society"
    ],
    debateExperience: "1- Ranked first as Best Speaker representing the American University of Beirut at the university-level debate championship.\n2- Ranked second as Best Speaker at the school-level debate championship.\n3- Participated in the international championship in Qatar representing Lebanon; the team secured sixth place.\n4- Debate coach and public speaking \n5- Mun previous delegate and advisor",
    motivation: "To share thoughts and opinions with different cultures and to get know them more.",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6nbfqr",
    name: "Sümeyye Bulut",
    email: "sumeyye.bulut@stu.ihu.edu.tr",
    password: "542008.Hfz",
    country: "Türkiye",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Governance & Society"
    ],
    debateExperience: "7th ınternational debate in Qatar\n2th Europe championaship in İstanbul\n7th national debate in Türkiye\nMUN as delegate and under secretary general\n(al of them in Arabic language)",
    motivation: "I want to improve myself about global issues and Arabic language",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6m3tdy",
    name: "ساجية حسين",
    email: "sagiasaadadien@gmail.com",
    password: "sagiaaaaa",
    country: "ليبيا",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Governance & Society"
    ],
    debateExperience: "خبرة لمدة عامين في مجال المناظرات : عضو في المنتخب الليبي في البطوله الدولية لمناظرات المدارس ، حكمت في بطولات محليه و بطوله وطنيه ، كنت جزء من المدربين في تدريب أساسيات المناظره لطلبة المدارس و الجامعات محلياً",
    motivation: "انطلاقاً من خبرتي كعضو في الفريق الوطني للمناظرات الدولية، أطمح للمشاركة في هذا الحوار لتبادل الآراء حول الشؤون الدولية بأسلوب حواري رصين، والعمل مع النخب الشبابية على تعزيز التعاون الأكاديمي والفكري",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13"
  },
  {
    id: "app_mv6lokgc",
    name: "Shoucky Xd",
    email: "shouckyxd@gmail.com",
    password: "shouckyndr4ever",
    country: "India",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Governance & Society"
    ],
    debateExperience: "Beginner in BP debate",
    motivation: "Want to make some awesome changes",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13"
  },
  {
    id: "app_mv6ksuke",
    name: "Lamar Emad Dauod",
    email: "lamaremad514@gmail.com",
    password: "imlamaremad",
    country: "Jordan",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Technology & AI",
      "Education & Knowledge",
      "Environment & Climate",
      "Economy & Trade",
      "Governance & Society"
    ],
    debateExperience: "Qatar debatesss",
    motivation: ",,,,,",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6kkoj6",
    name: "Jwan Haitham",
    email: "jwanly462@gmail.com",
    password: "jwan@2009",
    country: "Jordan",
    flag: "INT",
    interests: [
      "Technology & AI",
      "Education & Knowledge",
      "Governance & Society"
    ],
    debateExperience: "I received intensive training from leading debate experts in Jordan through the Jordan Debates Foundation and the Crown Prince Foundation. I primarily competed as a third speaker, but I am capable of taking on any debating role. I won first place as the Best Debater in Jordan and served as the captain of the Jordanian team in a competition held in Qatar last year, where we reached the semi-finals.",
    motivation: "I believe this organization has great potential, and that with dedicated work and development, it can reach new horizons and become a recognized global platform for dialogue. I believe I can play an active role in the organization to the best of my ability. Although my time is very limited due to my academic commitments, I will do my best to contribute to the development of the organization alongside you, while also developing and growing through this experience.",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6jt05t",
    name: "Zineb chahed Haffaci",
    email: "chahedhaffaci@gmail.com",
    password: "chahouuda2008",
    country: "Algeria",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Technology & AI",
      "Education & Knowledge",
      "Environment & Climate",
      "Economy & Trade",
      "Governance & Society"
    ],
    debateExperience: "Qatar debate",
    motivation: "To learn new skills",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13"
  },
  {
    id: "app_mv6iqmtn",
    name: "Rana Ali AbdElazeem",
    email: "ranaali.o644@gmail.com",
    password: "Ranaali@12345",
    country: "Sudan",
    flag: "INT",
    interests: [
      "Technology & AI",
      "Education & Knowledge",
      "Environment & Climate"
    ],
    debateExperience: "Qatar debates, high school debater, coach and judg sometimes",
    motivation: "Because I’m interested in growing my skills more and more",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13",
    role: "Presenter",
    isApprovedPresenter: true
  },
  {
    id: "app_mv6gpurj",
    name: "Menna Hassuna",
    email: "mennahassuna@gmail.com",
    password: "menna2009",
    country: "Libya",
    flag: "INT",
    interests: [
      "Global Affairs",
      "Technology & AI",
      "Governance & Society",
      "philosophy, Everything that comes to mind but hasn't been given a second thought."
    ],
    debateExperience: "I participated in two local and national championships at the Libyan level and won them with my team, and I received the third best speaker award and the first best speaker award nationally, respectively. Currently participating in MUN Misrata, and an accredited judge by my debate foundation",
    motivation: "To spread the culture of dialogue to as many people as possible, to help myself, and to develop relationships",
    status: "Approved",
    emailVerified: true,
    date: "2026-10-13"
  }
];

async function seedProductionUsers() {
  await connectDatabase();
  console.log('🌱 Connected to database. Seeding 10 users...');

  let userCount = 0;
  let appCount = 0;

  for (const item of RAW_USERS) {
    const email = item.email.toLowerCase().trim();
    const isPresenter = true;
    const targetRole: UserRole = ROLES.PRESENTER;
    const hashedPassword = await hashPassword(item.password);
    const createdAtDate = item.date ? new Date(item.date) : new Date();

    // 1. Seed or Upsert User
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: item.name.trim(),
        email,
        passwordHash: hashedPassword,
        role: targetRole,
        status: 'active',
        emailVerified: true,
        country: item.country || 'Global',
        flag: item.flag || 'INT',
        interests: item.interests || ['Global Affairs'],
        areasOfInterest: item.interests || ['Global Affairs'],
        experience: item.debateExperience || '',
        bio: item.debateExperience || '',
        motivation: item.motivation || '',
        createdAt: createdAtDate,
      });
      console.log(`✅ Created User: ${user.name} (${user.email}) -> Role: ${targetRole}`);
    } else {
      user.name = item.name.trim();
      user.passwordHash = hashedPassword;
      user.role = targetRole;
      user.status = 'active';
      user.emailVerified = true;
      user.country = item.country || user.country;
      user.interests = item.interests || user.interests;
      user.areasOfInterest = item.interests || user.areasOfInterest;
      user.experience = item.debateExperience || user.experience;
      user.bio = item.debateExperience || user.bio;
      user.motivation = item.motivation || user.motivation;
      await user.save();
      console.log(`🔄 Updated User: ${user.name} (${user.email}) -> Role: ${targetRole}`);
    }
    userCount++;

    // 2. Seed or Upsert Corresponding Application
    let app = await Application.findOne({ email });
    const proposalData = isPresenter ? {
      countryChapter: `${item.country || 'Global'} Delegation`,
      sphere: item.interests?.[0] || 'Global Affairs',
      proposedTopic: 'Academic Presentation & Keynote',
      experience: item.debateExperience || 'International debater & public speaker',
      preferredFormat: 'Topic Presentation (Presenter / Keynote)',
      statementOfIntent: item.motivation || 'Committed to fostering international dialogue and exchange.',
      appliedAt: createdAtDate,
      status: 'approved' as const,
    } : undefined;

    if (!app) {
      app = await Application.create({
        applicantName: item.name.trim(),
        email,
        password: item.password,
        country: item.country || 'Global',
        flag: item.flag || 'INT',
        experience: item.debateExperience || '',
        motivation: item.motivation || '',
        areasOfInterest: item.interests || ['Global Affairs'],
        preferredLanguages: ['English', 'Arabic'],
        status: 'approved',
        emailVerified: true,
        isApprovedPresenter: isPresenter,
        presenterProposal: proposalData,
        linkedUser: user._id as any,
        createdAt: createdAtDate,
      });
      console.log(`✅ Created Application: ${app.applicantName} (${app.email})`);
    } else {
      app.applicantName = item.name.trim();
      app.password = item.password;
      app.country = item.country || app.country;
      app.experience = item.debateExperience || app.experience;
      app.motivation = item.motivation || app.motivation;
      app.areasOfInterest = item.interests || app.areasOfInterest;
      app.status = 'approved';
      app.emailVerified = true;
      app.isApprovedPresenter = isPresenter;
      if (isPresenter) {
        app.presenterProposal = proposalData;
      }
      app.linkedUser = user._id as any;
      await app.save();
      console.log(`🔄 Updated Application: ${app.applicantName} (${app.email})`);
    }
    appCount++;
  }

  console.log(`\n🎉 Successfully seeded ${userCount} users and ${appCount} applications into the production database!`);
  await disconnectDatabase();
}

seedProductionUsers().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
