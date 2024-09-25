// const express = require('express');
// const app = express();
// const port = 5000;
// const ExcelJS = require('exceljs');
// const bodyParser = require('body-parser');
// const path = require('path');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Serve static files (optional, if you have any)
// app.use(express.static('public'));

// // Endpoint to handle form submission
// app.post('/save', (req, res) => {
//     console.log('Form data received:', req.body);
//     const formData = req.body;

//     // Create a new workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('PR Form Data');

//     // Define headers for the Excel sheet
//     const headers = [
//         'Input Date', 'Vendor Name', 'Vendor Address', 'City', 'Zip Code',
//         'State', 'Vendor Code', 'Vendor Contact Number', 'Vendor Email Address',
//         'Shipping Address', 'Shipping City', 'Shipping Zip Code', 'Shipping State',
//         'Plant Code', 'Document Type', 'Purchasing Organization', 'Purchasing Group',
//         'Company Code', 'Subtotal', 'Tax Code', 'Control Code', 'Reason for Ordering',
//         'Material Group', 'WBS Element', 'Tracking Number'
//     ];

//     // Add headers to the sheet
//     sheet.addRow(headers);

//     // Extract data from formData and add to Excel sheet
//     const dataRow = [
//         formData.inputDate, formData.vendorName, formData.vendorAddress,
//         formData.vendorCity, formData.vendorZip, formData.vendorState,
//         formData.vendorCode, formData.vendorContact, formData.vendorEmail,
//         formData.shippingAddress, formData.shippingCity, formData.shippingZip,
//         formData.shippingState, formData.plantCode, formData.documentType,
//         formData.purchasingOrganization, formData.purchasingGroup,
//         formData.companyCode, formData.subtotal, formData.taxCode,
//         formData.controlCode, formData.reasonForOrdering, formData.materialGroup,
//         formData.wbsElement, formData.trackingNumber
//     ];

//     // Add data row to the sheet
//     sheet.addRow(dataRow);

//     // Ensure that table fields are in array format
//     const items = Array.isArray(formData['item[]']) ? formData['item[]'] : [formData['item[]']];
//     const accountAssignmentCategories = Array.isArray(formData['accountAssignmentCategory[]']) ? formData['accountAssignmentCategory[]'] : [formData['accountAssignmentCategory[]']];
//     const materialCodes = Array.isArray(formData['materialCode[]']) ? formData['materialCode[]'] : [formData['materialCode[]']];
//     const descriptions = Array.isArray(formData['description[]']) ? formData['description[]'] : [formData['description[]']];
//     const quantities = Array.isArray(formData['quantity[]']) ? formData['quantity[]'] : [formData['quantity[]']];
//     const amounts = Array.isArray(formData['amount[]']) ? formData['amount[]'] : [formData['amount[]']];

//     // Add each row of table data to the Excel sheet
//     for (let i = 0; i < items.length; i++) {
//         const rowData = [
//             '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
//             items[i], accountAssignmentCategories[i], materialCodes[i], descriptions[i], quantities[i], amounts[i],
//             formData.partnerFunction, formData.assetNumber
//         ];
//         sheet.addRow(rowData);
//     }
 

//     // Define the file path for saving
//     const filePath = path.join('F:', 'PR form', 'pr_form_data.xlsx');

//     // Function to save workbook with retry logic
//     function saveWorkbookWithRetry(retries) {
//         workbook.xlsx.writeFile(filePath)
//             .then(() => {
//                 console.log('Excel file saved successfully.');
//                 res.sendFile(filePath); // Optionally, you can send the file back to the client
//             })
//             .catch((error) => {
//                 if (error.code === 'EBUSY' && retries > 0) {
//                     console.error('Resource busy, retrying...');
//                     setTimeout(() => saveWorkbookWithRetry(retries - 1), 1000); // Retry after 1 second
//                 } else {
//                     console.error('Error saving Excel file:', error);
//                     res.status(500).send('Failed to save Excel file.');
//                 }
//             });
//     }

//     // Start the save process with up to 3 retries
//     saveWorkbookWithRetry(3);
// });

// // Welcome message for the root URL
// app.get('/', (req, res) => {
//     res.send('Welcome to the PR Form Submission App');
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });








const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Initialize Express
const app = express();
const port = 5000;
app.use(express.static('public'));
dotenv.config({ path: 'uri.env' });

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


// Define a schema and model for PR Form Data
const prFormSchema = new mongoose.Schema({
    inputDate: String,
    vendorName: String,
    vendorAddress: String,
    city: String,
    zipCode: String,
    state: String,
    vendorCode: String,
    vendorContactNumber: String,
    vendorEmailAddress: String,
    shippingAddress: String,
    shippingCity: String,
    shippingZipCode: String,
    shippingState: String,
    plantCode: String,
    documentType: String,
    purchasingOrganization: String,
    purchasingGroup: String,
    companyCode: String,
    subtotal: String,
    taxCode: String,
    controlCode: String,
    reasonForOrdering: String,
    materialGroup: String,
    wbsElement: String,
    trackingNumber: String,
    items: [String],
    accountAssignmentCategories: [String],
    materialCodes: [String],
    descriptions: [String],
    quantities: [String],
    amounts: [String],
    partnerFunction: String,
    assetNumber: String,
});

// Create a model
const PrForm = mongoose.model('PrForm', prFormSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (optional)
app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/save', async (req, res) => {
    console.log('Form data received:', req.body);
    const formData = req.body;

    // Extract data from formData
    const items = Array.isArray(formData['item[]']) ? formData['item[]'] : [formData['item[]']];
    const accountAssignmentCategories = Array.isArray(formData['accountAssignmentCategory[]']) ? formData['accountAssignmentCategory[]'] : [formData['accountAssignmentCategory[]']];
    const materialCodes = Array.isArray(formData['materialCode[]']) ? formData['materialCode[]'] : [formData['materialCode[]']];
    const descriptions = Array.isArray(formData['description[]']) ? formData['description[]'] : [formData['description[]']];
    const quantities = Array.isArray(formData['quantity[]']) ? formData['quantity[]'] : [formData['quantity[]']];
    const amounts = Array.isArray(formData['amount[]']) ? formData['amount[]'] : [formData['amount[]']];

    // Create a new document to save in MongoDB
    const prFormData = new PrForm({
        inputDate: formData.inputDate,
        vendorName: formData.vendorName,
        vendorAddress: formData.vendorAddress,
        city: formData.vendorCity,
        zipCode: formData.vendorZip,
        state: formData.vendorState,
        vendorCode: formData.vendorCode,
        vendorContactNumber: formData.vendorContact,
        vendorEmailAddress: formData.vendorEmail,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingZipCode: formData.shippingZip,
        shippingState: formData.shippingState,
        plantCode: formData.plantCode,
        documentType: formData.documentType,
        purchasingOrganization: formData.purchasingOrganization,
        purchasingGroup: formData.purchasingGroup,
        companyCode: formData.companyCode,
        subtotal: formData.subtotal,
        taxCode: formData.taxCode,
        controlCode: formData.controlCode,
        reasonForOrdering: formData.reasonForOrdering,
        materialGroup: formData.materialGroup,
        wbsElement: formData.wbsElement,
        trackingNumber: formData.trackingNumber,
        items: items,
        accountAssignmentCategories: accountAssignmentCategories,
        materialCodes: materialCodes,
        descriptions: descriptions,
        quantities: quantities,
        amounts: amounts,
        partnerFunction: formData.partnerFunction,
        assetNumber: formData.assetNumber,
    });

    // Save the document to MongoDB
    try {
        await prFormData.save();
        console.log('Data saved to MongoDB successfully.');
        res.status(201).send('Form data saved successfully.');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Failed to save form data.');
    }
});

// Welcome message for the root URL
// app.get('/', (req, res) => {
//     res.send('Welcome to the PR Form Submission App');
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
