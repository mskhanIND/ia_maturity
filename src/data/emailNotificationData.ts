import { EmailNotificationItem } from '../types';

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotificationItem[] = [
  {
    id: 'eml-101',
    assessment_id: 'ASM-2026-004',
    assessment_name: 'ASM-2026-004 (Saudi Logistics & Supply Chain)',
    entity_name: 'Saudi Logistics & Supply Chain Co.',
    recipient_email: 'compliance@saudilogistics.sa',
    recipient_name: 'Majed Al-Mutairi',
    trigger_type: 'clarification_required',
    subject: '[ACTION REQUIRED] GRC Assessment Clarification Required: Saudi Logistics & Supply Chain Co.',
    subject_ar: '[إجراء مطلوب] مطلوب إيضاحات على تقييم نضج التدقيق الداخلي: شركة سلاسل الإمداد اللوجستية',
    body: `Dear Majed Al-Mutairi,

The IRSAA GRC advisory team has reviewed your assessment responses for "Saudi Logistics & Supply Chain Co." (ASM-2026-004) and requested clarifications regarding Question Q3 (Whistleblowing independent hotline) and Question Q15 (Competency framework & certifications).

Please log in to your Client Portal to review the reviewer comments, reply to the discussion thread, and provide supplementary evidence to enable final approval.

SLA Deadline for Clarifications: 5 business days.

Warm regards,
Tariq Al-Mansoor
Senior GRC Consultant & Assessor
IRSAA GRC Advisory · Riyadh, Kingdom of Saudi Arabia`,
    body_ar: `عزيزي الأستاذ ماجد المطيري،

قام فريق الاستشارات في إرساء بمراجعة إجابات تقييم النضج الخاص بشركة سلاسل الإمداد والخدمات اللوجستية (ASM-2026-004)، وهناك استفسارات وإيضاحات مطلوبة بخصوص السؤال Q3 (قنوات الإبلاغ عن المخالفات) والسؤال Q15 (إطار الجدارات والشهادات المهنية).

يرجى الدخول إلى بوابة العميل للاطلاع على ملاحظات المراجع والرد عليها وإرفاق الأدلة الداعمة لاعتماد التقرير النهائي.

المهلة المحددة للرد: 5 أيام عمل.

وتفضلوا بقبول فائق الاحترام،
طارق المنصور
مستشار أول الحوكمة والمخاطر والالتزام
إرساء للاستشارات · الرياض، المملكة العربية السعودية`,
    sent_at: '2026-10-22 19:15',
    status: 'delivered',
    urgency: 'urgent',
    due_date: '2026-10-27',
    days_until_deadline: 4,
  },
  {
    id: 'eml-102',
    assessment_id: 'ASM-2026-004',
    assessment_name: 'ASM-2026-004 (Saudi Logistics & Supply Chain)',
    entity_name: 'Saudi Logistics & Supply Chain Co.',
    recipient_email: 'compliance@saudilogistics.sa',
    recipient_name: 'Majed Al-Mutairi',
    trigger_type: 'deadline_approaching',
    subject: '[REMINDER] Assessment Submission Deadline Approaching (48 Hours Remaining)',
    subject_ar: '[تذكير] اقتراب موعد استحقاق تسليم التقييم (متبقي 48 ساعة)',
    body: `Dear Majed Al-Mutairi,

This automated notice is to remind you that your Internal Audit Maturity Assessment deadline for Saudi Logistics & Supply Chain Co. is approaching on October 25, 2026.

Your current progress: 12/20 questions completed (60%).
Unanswered questions: 8 questions remaining.

To ensure peer benchmarking calculation and inclusion in the upcoming board reporting cycle, please complete and submit your responses before the deadline.

Access Portal: https://portal.irsaa.sa/assessments/ASM-2026-004

IRSAA GRC Automated Dispatch Engine
Riyadh, Kingdom of Saudi Arabia`,
    body_ar: `عزيزي الأستاذ ماجد المطيري،

نود تذكيركم باقتراب الموعد النهائي لتسليم تقييم نضج التدقيق الداخلي لشركة سلاسل الإمداد والخدمات اللوجستية والمحدد بتاريخ 25 أكتوبر 2026.

نسبة الإنجاز الحالية: 12 من 20 سؤالاً (60%).
الأسئلة المتبقية: 8 أسئلة.

لضمان إدراج نتيجتكم في تقرير المقارنة المعيارية للقطاع، يرجى استكمال الأسئلة وتقديم التقييم قبل نهاية المهلة.

بوابة العميل: https://portal.irsaa.sa/assessments/ASM-2026-004

محرك الإشعارات الآلي لمنصة إرساء للحوكمة
الرياض، المملكة العربية السعودية`,
    sent_at: '2026-10-23 08:00',
    status: 'delivered',
    urgency: 'urgent',
    due_date: '2026-10-25',
    days_until_deadline: 2,
  },
  {
    id: 'eml-103',
    assessment_id: 'ASM-2026-001',
    assessment_name: 'ASM-2026-001 (Al-Noor Financial Group)',
    entity_name: 'Al-Noor Financial Group',
    recipient_email: 'sarah.ghamdi@alnoor-finance.sa',
    recipient_name: 'Sarah Al-Ghamdi',
    trigger_type: 'report_released',
    subject: '[OFFICIAL RELEASE] Internal Audit Function Maturity Assessment Report (GIAS 2024 Approved)',
    subject_ar: '[تقرير رسمي معتمد] تم إصدار التقرير النهائي لتقييم نضج إدارة التدقيق الداخلي',
    body: `Dear Sarah Al-Ghamdi,

We are pleased to inform you that your Internal Audit Maturity Assessment for Al-Noor Financial Group (ASM-2026-001) has been approved and formally released by IRSAA Advisory Director Dr. Khalid Al-Zahrani.

Final Maturity Level: Level 3 – Established (76.25%)
Total Action Recommendations: 3 priority remediation initiatives
Official Certified PDF: Available for immediate download in your Portal

You can now generate Board and Audit Committee presentation packs directly from your Portal Scorecard dashboard.

Congratulations on completing this governance milestone.

Dr. Khalid Al-Zahrani
Director of GRC Advisory Services
IRSAA Business Solutions · Riyadh, Kingdom of Saudi Arabia`,
    body_ar: `سعادة الأستاذة سارة الغامدي،

يسرنا إبلاغكم بأنه تم اعتماد وإصدار التقرير الرسمي لتقييم نضج وظيفة التدقيق الداخلي لمجموعة النور المالية (ASM-2026-001) من قبل مدير الاستشارات الدكتور خالد الزهراني.

مستوى النضج النهائي: المستوى الثالث – راسخ (76.25%)
مبادرات التحسين الموصى بها: 3 إجراءات تصحيحية ذات أولوية
التقرير المعتمد (PDF): متاح للتنزيل المباشر الآن عبر بوابتكم

يمكنكم تصدير العرض الموجه للجنة المراجعة ومجلس الإدارة مباشرة من لوحة المؤشرات.

د. خالد الزهراني
مدير خدمات استشارات الحوكمة والمخاطر
إرساء لحلول الأعمال · الرياض، المملكة العربية السعودية`,
    sent_at: '2026-10-21 15:00',
    status: 'delivered',
    urgency: 'normal',
    due_date: '2026-10-21',
  },
];
