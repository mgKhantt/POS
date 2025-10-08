const Product = require("../../models/Products");
const PDFDocument = require('pdfkit');
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const getAdminCashierPage = async (req, res) => {
    const products = await Product.find();
    res.render("admin/orders/AdminCashierModePage", {
        layout: "./layouts/adminApp",
        docTitle: "Cashier",
        pageTitle: "Cashier",
        products: products
    });
}

// const postCheckOut = async (req, res) => {
//   try {
//     const { cart, total } = req.body;
//     console.log("Received checkout data:", cart, total);

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=voucher_${Date.now()}.pdf`);

//     const PDFDocument = require('pdfkit'); // ✅ ensure imported
//     const doc = new PDFDocument({ margin: 50 });
//     doc.pipe(res);

//     doc.fontSize(25).text('Code Crafters POS Voucher', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(16).fillColor('#0d9488').text('Transaction Details', { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(12).fillColor('#374151').text(`Date: ${new Date().toLocaleString()}`);
//     doc.moveDown(1);

//     // Headers
//     doc.text('Item', 50, doc.y, { width: 250 })
//        .text('Qty', 300, doc.y, { width: 100, align: 'right' })
//        .text('Price', 400, doc.y, { width: 100, align: 'right' })
//        .text('Total', 500, doc.y, { width: 50, align: 'right' });
//     doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
//     doc.moveDown(0.2);

//     cart.forEach(item => {
//       const itemTotal = (item.price * item.qty).toFixed(2);
//       doc.text(item.name, 50, doc.y, { width: 250, continued: true })
//          .text(item.qty.toString(), 300, doc.y, { width: 100, align: 'right', continued: true })
//          .text(`$${item.price.toFixed(2)}`, 400, doc.y, { width: 100, align: 'right', continued: true })
//          .text(`$${itemTotal}`, 500, doc.y, { width: 50, align: 'right' });
//       doc.moveDown(0.5);
//     });

//     doc.moveDown(1);
//     doc.strokeColor('#0d9488').lineWidth(2).moveTo(350, doc.y).lineTo(550, doc.y).stroke();
//     doc.moveDown(0.2);
//     doc.fontSize(18).fillColor('#0d9488')
//        .text('GRAND TOTAL:', 350, doc.y, { width: 150, align: 'left', continued: true })
//        .text(`$${total.toFixed(2)}`, 500, doc.y, { width: 50, align: 'right' });

//     doc.end();
//   } catch (err) {
//     console.error("Error generating voucher:", err);
//     res.status(500).json({ message: "Voucher generation failed", error: err.message });
//   }
// };

const postCheckOut  = async (order) => {
  try {
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 150], // small receipt size
    });

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("UniMart POS", 40, 10, { align: "center" });

    doc.setFontSize(10);
    doc.text("Thank you for shopping!", 40, 15, { align: "center" });
    doc.line(5, 18, 75, 18);

    // --- Order Details ---
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order._id}`, 5, 25);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 5, 30);
    doc.line(5, 33, 75, 33);

    // --- Items Table ---
    let y = 38;
    doc.setFont("helvetica", "bold");
    doc.text("Item", 5, y);
    doc.text("Qty", 35, y);
    doc.text("Price", 55, y);
    y += 5;
    doc.setFont("helvetica", "normal");

    order.items.forEach((item) => {
      doc.text(item.name.substring(0, 12), 5, y);
      doc.text(`${item.quantity}`, 37, y, { align: "right" });
      doc.text(`${item.price.toFixed(2)}`, 75, y, { align: "right" });
      y += 5;
    });

    doc.line(5, y, 75, y);
    y += 6;

    // --- Totals ---
    doc.text(`Subtotal: ${order.subtotal.toFixed(2)}`, 75, y, { align: "right" });
    y += 5;
    doc.text(`Tax: ${order.tax.toFixed(2)}`, 75, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${order.total.toFixed(2)}`, 75, y, { align: "right" });

    // --- Footer ---
    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Visit Again!", 40, y, { align: "center" });

    const filePath = path.join(__dirname, `../vouchers/voucher-${order._id}.pdf`);
    doc.save(filePath);

    return filePath;
  } catch (err) {
    console.error("Error generating voucher:", err);
    throw new Error("Voucher generation failed.");
  }
};

exports.getAdminCashierPage = getAdminCashierPage;
exports.postCheckOut = postCheckOut;