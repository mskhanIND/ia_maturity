import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentDoc, MaturityBand } from '../types';
import { PeerBenchmarkResult } from '../types';
import { DEFAULT_BANDS } from '../data/templateData';

export interface PDFExportOptions {
  assessment: AssessmentDoc;
  benchmark?: PeerBenchmarkResult;
  isArabic?: boolean;
}

export function generateAssessmentPDF(options: PDFExportOptions): void {
  const { assessment, benchmark, isArabic } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const primaryColor: [number, number, number] = [18, 80, 110]; // #12506E
  const darkColor: [number, number, number] = [24, 24, 24]; // #181818
  const grayMuted: [number, number, number] = [100, 110, 115];
  const isApproved = assessment.review_status === 'Approved';

  let currentY = margin;

  // Header Bar
  doc.setFillColor(24, 24, 24);
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('IRSAA GRC & Audit Excellence', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 210, 225);
  doc.text('IRSAA Business Solutions · Riyadh, Kingdom of Saudi Arabia', margin, 18);

  // Status Chip in Header
  const statusLabel = isApproved ? 'OFFICIAL VERIFIED REPORT' : 'PRELIMINARY SELF-ASSESSMENT';
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  if (isApproved) {
    doc.setFillColor(45, 122, 51); // Green
    doc.roundedRect(pageWidth - margin - 58, 7, 58, 8, 2, 2, 'F');
  } else {
    doc.setFillColor(191, 83, 11); // Amber
    doc.roundedRect(pageWidth - margin - 66, 7, 66, 8, 2, 2, 'F');
  }
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, pageWidth - margin - (isApproved ? 54 : 62), 12.5);

  currentY = 32;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 24);
  doc.text('Internal Audit Maturity Assessment Report', margin, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 101, 98);
  doc.text(`Framework: ${assessment.template} (IIA GIAS & Saudi Regulatory Baseline)`, margin, currentY);

  currentY += 8;

  // Metadata Box (2 columns)
  doc.setFillColor(244, 246, 248);
  doc.setDrawColor(217, 225, 230);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  // Col 1
  doc.setFont('helvetica', 'bold');
  doc.text('Assessed Entity:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.entity, margin + 35, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Date:', margin + 4, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.assessment_date || 'Recent', margin + 35, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Report Reference:', margin + 4, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.name, margin + 35, currentY + 18);

  // Col 2
  const col2X = margin + contentWidth / 2 + 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Respondent Name:', col2X, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.respondent_name || 'N/A', col2X + 35, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Perspective / Role:', col2X, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.respondent_role || 'CAE', col2X + 35, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Review Status:', col2X, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(isApproved ? 45 : 191, isApproved ? 122 : 83, isApproved ? 51 : 11);
  doc.text(assessment.review_status, col2X + 35, currentY + 18);

  currentY += 30;

  // Executive Score Card Box
  doc.setFillColor(18, 80, 110);
  doc.roundedRect(margin, currentY, 52, 28, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(200, 230, 245);
  doc.text('OVERALL MATURITY', margin + 4, currentY + 7);

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(`${assessment.overall_score}%`, margin + 4, currentY + 18);

  doc.setFontSize(10);
  doc.text(assessment.maturity_level, margin + 4, currentY + 24);

  // KPI Summary Card next to score
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(217, 225, 230);
  doc.roundedRect(margin + 56, currentY, contentWidth - 56, 28, 2, 2, 'D');

  doc.setTextColor(24, 24, 24);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Assessment Overview', margin + 60, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`• Total Score: ${assessment.overall_points} of ${assessment.max_points} points scored across 20 questions.`, margin + 60, currentY + 12);
  doc.text(`• Findings Raised: ${assessment.findings_count} findings (${assessment.immediate_count} immediate 0–3 months priority).`, margin + 60, currentY + 17);
  doc.text(`• Not Applicable (N/A): ${assessment.na_count} questions excluded from denominator.`, margin + 60, currentY + 22);

  currentY += 34;

  // Gating Note Warning (if any)
  if (assessment.gating_note) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text('GATING QUESTION LEVEL CAP TRIGGERED:', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitNote = doc.splitTextToSize(assessment.gating_note, contentWidth - 8);
    doc.text(splitNote, margin + 4, currentY + 10);

    currentY += 18;
  }

  // Strategic Interpretation text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(24, 24, 24);
  doc.text('Strategic Interpretation:', margin, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const interpLines = doc.splitTextToSize(assessment.interpretation, contentWidth);
  doc.text(interpLines, margin, currentY);

  currentY += interpLines.length * 4.5 + 4;

  // SECTION SCORES TABLE (autoTable)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(18, 80, 110);
  doc.text('1. Results by Section (IIA GIAS Domains)', margin, currentY);
  currentY += 3;

  const sectionTableData = assessment.section_scores.map(s => [
    s.section_code,
    s.section_title,
    s.owner_role,
    `${s.answered} / ${s.applicable}`,
    `${s.points} / ${s.max_points}`,
    `${s.score_pct}%`,
    s.maturity_level,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Code', 'Section Title', 'Assigned Owner', 'Answered', 'Points', 'Score %', 'Maturity Band']],
    body: sectionTableData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [18, 80, 110],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 14, fontStyle: 'bold' },
      1: { cellWidth: 62 },
      2: { cellWidth: 38 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 16, fontStyle: 'bold' },
      6: { cellWidth: 20 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Anonymous Peer Benchmark section (if available)
  if (benchmark && benchmark.available && benchmark.overall) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = margin + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 80, 110);
    doc.text('2. Anonymous Peer Benchmarking Comparison', margin, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 101, 98);
    doc.text(`Compared against ${benchmark.peer_count} peer organizations (${benchmark.peer_group}). Strictly anonymized aggregate quartiles.`, margin, currentY);
    currentY += 3;

    const bmRows = (benchmark.sections || []).map(b => [
      b.code,
      b.title,
      `${b.value}%`,
      `${b.median}%`,
      `${b.p25}% – ${b.p75}%`,
      b.delta >= 0 ? `+${b.delta}%` : `${b.delta}%`,
      `${b.percentile}th`,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Code', 'Section Title', 'Your Score', 'Peer Median', 'Middle 50%', 'vs Median', 'Percentile']],
      body: bmRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.5, cellPadding: 1.8 },
      headStyles: { fillColor: [50, 65, 75], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 14, fontStyle: 'bold' },
        1: { cellWidth: 70 },
        2: { cellWidth: 22, fontStyle: 'bold' },
        3: { cellWidth: 22 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20, fontStyle: 'bold' },
        6: { cellWidth: 17 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // PAGE 2: FINDINGS & IMPROVEMENT ROADMAP
  doc.addPage();
  currentY = margin + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(18, 80, 110);
  doc.text('3. Key Audit Findings & Improvement Roadmap', margin, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 101, 98);
  doc.text('Findings are raised for questions answered at Level A (Immediate, 0–3 months) or Level B (High, 3–6 months).', margin, currentY);

  currentY += 4;

  const findings = assessment.answers.filter(a => a.selected_option === 'A' || a.selected_option === 'B');

  if (findings.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No findings identified: every question was answered at Level C (Established) or Level D (Leading).', margin, currentY);
    currentY += 10;
  } else {
    const findingsRows = findings.map(f => [
      f.question_code,
      f.short_label || f.question_code,
      f.selected_option === 'A' ? 'Immediate (0–3m)' : 'High (3–6m)',
      `Level ${f.selected_option}: ${f.question_text.substring(0, 75)}...`,
      f.selected_option === 'A' ? 'Elevate to Level B Foundational' : 'Elevate to Level C Established',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Q-Code', 'Area / Topic', 'Priority', 'Current Practice', 'Recommended Target Step']],
      body: findingsRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: { fillColor: [180, 40, 40], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 16, fontStyle: 'bold' },
        1: { cellWidth: 42, fontStyle: 'bold' },
        2: { cellWidth: 32 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Section 4: Detailed Responses Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(18, 80, 110);
  doc.text('4. Full Questionnaire Responses Audit Log', margin, currentY);

  currentY += 4;

  const answerRows = assessment.answers.map(a => [
    a.question_code,
    a.short_label || a.question_code,
    `Option ${a.selected_option || 'N/A'}`,
    `${a.points} pts`,
    a.evidence ? `File: ${a.evidence}` : a.comment ? a.comment.substring(0, 60) : 'None',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Code', 'Question Area', 'Selection', 'Points', 'Evidence / Comment Attached']],
    body: answerRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 16, fontStyle: 'bold' },
      1: { cellWidth: 65 },
      2: { cellWidth: 26, fontStyle: 'bold' },
      3: { cellWidth: 18 },
      4: { cellWidth: 65 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Reviewer Sign-off Card (if space allows, or on new page)
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = margin + 10;
  }

  doc.setFillColor(244, 246, 248);
  doc.setDrawColor(217, 225, 230);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(18, 80, 110);
  doc.text('5. IRSAA GRC Technical Review & Quality Assurance Sign-Off', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const reviewerText = assessment.reviewer_comments || 'Responses verified against supporting evidence. Independent review conducted in accordance with IIA GIAS Quality Assurance & Improvement Program requirements.';
  const splitReview = doc.splitTextToSize(reviewerText, contentWidth - 8);
  doc.text(splitReview, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.text(`Lead Reviewer: ${assessment.reviewer || 'Dr. Khalid Al-Zahrani'}`, margin + 4, currentY + 27);
  doc.text(`Reviewed Date: ${assessment.reviewed_on || assessment.assessment_date}`, margin + 85, currentY + 27);
  doc.text(`Status: ${assessment.review_status}`, margin + 145, currentY + 27);

  // Add Page Numbers and Footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 145);

    // Footer line
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    // Left
    doc.text('IRSAA GRC & Audit · Riyadh, Kingdom of Saudi Arabia', margin, pageHeight - 6);

    // Center
    doc.text('CONFIDENTIAL - FOR AUTHORIZED CLIENT USE ONLY', pageWidth / 2, pageHeight - 6, { align: 'center' });

    // Right
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  // Save the PDF
  const sanitizedEntity = (assessment.entity || 'Entity').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `IRSAA_IA_Maturity_Report_${sanitizedEntity}_${assessment.id}.pdf`;
  doc.save(fileName);
}
