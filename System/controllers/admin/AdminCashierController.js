const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const Product = require("../../models/Products");
const PDFDocument = require('pdfkit');
require('pdfkit-table'); // Extends PDFDocument with table() method
const getAdminCashierPage = async (req, res) => {
    const products = await Product.find();
    const categories = await Category.find();
    const brands = await Brand.find();

    res.render("admin/orders/AdminCashierModePage", {
        layout: "./layouts/adminApp",
        docTitle: "Cashier",
        pageTitle: "Cashier",
        products: products,
        categories: categories,
        brands: brands
    });
}

const postCheckOut = async (req, res) => {
  const { cart, total } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const grandTotal = parseFloat(total);
  if (isNaN(grandTotal)) {
    return res.status(400).json({ message: "Invalid total." });
  }

  try {
    // --- Layout Constants ---
    const PAGE_WIDTH = 300; // Smaller width for a thermal receipt feel
    const PAGE_HEIGHT = 600;
    const MARGIN = 15;
    const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
    const itemSpace = (PAGE_HEIGHT - 150) / cart.length; 
    
    // Calculated height to ensure all items fit
    const docHeight = Math.max(300, 200 +  cart.length * itemSpace); 
    const doc = new PDFDocument({ 
      size: [PAGE_WIDTH, docHeight], 
      margin: MARGIN 
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=voucher-${Date.now()}.pdf`);

    doc.pipe(res);

    // Helper function to draw a clean dashed line
    const drawSeparator = (doc, y) => {
      doc.moveTo(MARGIN, y)
         .lineTo(PAGE_WIDTH - MARGIN, y)
         .dash(2, { space: 2 })
         .strokeOpacity(0.5)
         .stroke();
      doc.undash();
      doc.strokeOpacity(1);
    };

    // --- Header ---
    doc.fontSize(18).font('Helvetica-Bold').text('UniMart POS', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping!', { align: 'center' });
    doc.moveDown(0.5);

    // --- Order Details ---
    drawSeparator(doc, doc.y);
    doc.moveDown(0.5);

    const now = new Date();
    doc.fontSize(9).font('Helvetica');
    doc.text(`Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, MARGIN);
    doc.text(`Order ID: ${Date.now()}`, MARGIN, doc.y);
    
    doc.moveDown(0.5);
    drawSeparator(doc, doc.y);

    // --- Table Header ---
    const xItem = MARGIN;
    // Set fixed positions based on the new PAGE_WIDTH
    const xQty = PAGE_WIDTH - MARGIN - 70;  // Qty starts 70px from right edge
    const xTotal = PAGE_WIDTH - MARGIN - 40; // Total starts 40px from right edge (right aligned)
    const ColWidths = [xQty - xItem, 30, 40]; // [Item Name Width, Qty Width, Total Width]

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Item', xItem, doc.y);
    doc.text('Qty', xQty - 13, 95, { width: 30, align: 'right'}); 
    doc.text('Total', xTotal, 95, { width: 40, align: 'right' }); 
    
    doc.moveDown(0.2);
    drawSeparator(doc, doc.y);

    // --- Cart Items ---
    doc.font('Courier').fontSize(10); // Use Courier (monospace) for perfect price alignment
    doc.moveDown(0.3);

    cart.forEach(item => {
      const itemTotal = (item.qty * item.price).toFixed(2);
      const name = item.name.length > 30 ? item.name.substring(0, 27) + "..." : item.name;

      // Item Name (left aligned)
      doc.text(name, xItem, doc.y, { width: ColWidths[0] - 5 }); 
      
      // Qty (centered in its column)
      doc.text(`x${item.qty}`, xQty - 10, doc.y - 10, { width: 30, align: 'center' }); 
      
      // Total (right aligned - crucial)
      doc.text(`$${itemTotal}`, xTotal - 10, doc.y - 10, { width: 50, align: 'right' }); 

      doc.moveDown(0.5); // Add a bit more spacing between items
    });

    drawSeparator(doc, doc.y);

    // --- Totals ---
    const taxRate = 0.07;
    const subtotal = grandTotal / (1 + taxRate);
    const tax = grandTotal - subtotal;
    const TOTALS_LEFT_COL_X = xItem;
    const TOTALS_RIGHT_COL_X = xTotal;

    // Helper to draw a total line with alignment
    const drawTotalLine = (label, amount, font, size, amountWidth = 60) => {
        doc.font(font).fontSize(size);
        const yPos = doc.y;

        // Calculate the starting X for amount column
        const amountX = PAGE_WIDTH - MARGIN - amountWidth;

        // Label on the left, takes all space up to the amount column
        doc.text(label, MARGIN, yPos, { width: amountX - MARGIN, align: 'left' });

        // Amount on the right, fixed width, right-aligned
        doc.text(`$${amount.toFixed(2)}`, amountX, yPos, { width: amountWidth, align: 'right' });

        doc.moveDown(0.2);
    };


    doc.moveDown(0.3);
    // Use Courier-Bold for better visual weight and alignment
    drawTotalLine('Subtotal:', subtotal, 'Courier-Bold', 10);
    drawTotalLine(`Tax (${(taxRate * 100).toFixed(0)}%):`, tax, 'Courier-Bold', 10);

    doc.moveDown(0.2);
    drawSeparator(doc, doc.y);
    doc.moveDown(0.8);
    
    // Grand Total is larger and more prominent
    drawTotalLine('GRAND TOTAL:', grandTotal, 'Courier-Bold', 14, 80);

    // doc.moveDown(1);
    drawSeparator(doc, doc.y);

    // --- Footer ---
    doc.moveDown(0.5);
    doc.font('Helvetica-Oblique')
   .fontSize(10)
   .text('Visit Again!', MARGIN, doc.y, { 
       width: PAGE_WIDTH - 2 * MARGIN, 
       align: 'center' 
   });

    doc.moveDown(0.2);

    doc.font('Helvetica')
      .fontSize(9)
      .text('Powered by Swiftly Learn', MARGIN, doc.y, { 
          width: PAGE_WIDTH - 2 * MARGIN, 
          align: 'center' 
      });

    doc.end();

  } catch (err) {
    console.error("Voucher generation failed:", err);
    // Only send the error response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ message: "Voucher generation failed", error: err.message });
    }
  }
};

exports.getAdminCashierPage = getAdminCashierPage;
exports.postCheckOut = postCheckOut;