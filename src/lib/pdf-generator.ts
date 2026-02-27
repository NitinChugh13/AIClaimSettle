import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export interface ClaimReportData {
    claimId: string;
    policyNumber: string;
    holderName: string;
    vehicleModel: string;
    vehicleReg: string;
    incidentType: string;
    incidentDate: string;
    incidentLocation: string;
    totalAmount: number;
    damageItems: Array<{
        partName: string;
        severity: string;
        action: string;
        netSubtotal: number;
    }>;
    status: string;
}

export const generateClaimReport = (data: ClaimReportData) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // primary dark blue
    doc.text('ClaimNova - Assessment Report', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, margin, y);
    y += 15;

    // Claim Info Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Claim Information', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;

    doc.setFontSize(12);
    const info = [
        ['Claim ID:', data.claimId],
        ['Policy Number:', data.policyNumber],
        ['Policy Holder:', data.holderName],
        ['Vehicle:', `${data.vehicleModel} (${data.vehicleReg})`],
        ['Incident Date:', data.incidentDate],
        ['Location:', data.incidentLocation],
        ['Status:', data.status.toUpperCase()],
    ];

    info.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 40, y);
        y += 7;
    });

    y += 10;

    // Damage Assessment Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Damage Assessment Results', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;

    // Table Header
    doc.setFontSize(10);
    doc.text('Part Name', margin, y);
    doc.text('Severity', margin + 60, y);
    doc.text('Action', margin + 100, y);
    doc.text('Amount (INR)', margin + 140, y);
    y += 7;
    doc.line(margin, y - 4, 190, y - 4);

    // Table Content
    data.damageItems.forEach((item) => {
        if (y > 270) {
            doc.addPage();
            y = margin;
        }
        doc.text(item.partName, margin, y);
        doc.text(item.severity, margin + 60, y);
        doc.text(item.action, margin + 100, y);
        doc.text(`Rs. ${item.netSubtotal.toLocaleString('en-IN')}`, margin + 140, y);
        y += 7;
    });

    y += 5;
    doc.line(margin, y - 4, 190, y - 4);

    // Total Amount
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Settlement Amount:', margin + 80, y + 5);
    doc.setTextColor(30, 58, 138);
    doc.text(`Rs. ${data.totalAmount.toLocaleString('en-IN')}`, margin + 145, y + 5);

    y += 20;

    // Footer Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');
    const disclaimer = 'This is an AI-generated assessment report. Final settlement is subject to verified document review and officer approval as per policy terms and conditions.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, margin, y);

    // Save PDF
    doc.save(`Assessment_Report_${data.claimId}.pdf`);
};
