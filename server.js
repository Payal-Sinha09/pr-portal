const express = require('express');
const app = express();
const port = 5000;
const ExcelJS = require('exceljs');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (optional, if you have any)
app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/save', (req, res) => {
    console.log('Form data received:', req.body);
    const formData = req.body;

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('PR Form Data');

    // Define headers for the Excel sheet
    const headers = [
        'Input Date', 'Vendor Name', 'Vendor Address', 'City', 'Zip Code',
        'State', 'Vendor Code', 'Vendor Contact Number', 'Vendor Email Address',
        'Shipping Address', 'Shipping City', 'Shipping Zip Code', 'Shipping State',
        'Plant Code', 'Document Type', 'Purchasing Organization', 'Purchasing Group',
        'Company Code', 'Subtotal', 'Tax Code', 'Control Code', 'Reason for Ordering',
        'Material Group', 'WBS Element', 'Tracking Number'
    ];

    // Add headers to the sheet
    sheet.addRow(headers);

    // Extract data from formData and add to Excel sheet
    const dataRow = [
        formData.inputDate, formData.vendorName, formData.vendorAddress,
        formData.vendorCity, formData.vendorZip, formData.vendorState,
        formData.vendorCode, formData.vendorContact, formData.vendorEmail,
        formData.shippingAddress, formData.shippingCity, formData.shippingZip,
        formData.shippingState, formData.plantCode, formData.documentType,
        formData.purchasingOrganization, formData.purchasingGroup,
        formData.companyCode, formData.subtotal, formData.taxCode,
        formData.controlCode, formData.reasonForOrdering, formData.materialGroup,
        formData.wbsElement, formData.trackingNumber
    ];

    // Add data row to the sheet
    sheet.addRow(dataRow);

    // Ensure that table fields are in array format
    const items = Array.isArray(formData['item[]']) ? formData['item[]'] : [formData['item[]']];
    const accountAssignmentCategories = Array.isArray(formData['accountAssignmentCategory[]']) ? formData['accountAssignmentCategory[]'] : [formData['accountAssignmentCategory[]']];
    const materialCodes = Array.isArray(formData['materialCode[]']) ? formData['materialCode[]'] : [formData['materialCode[]']];
    const descriptions = Array.isArray(formData['description[]']) ? formData['description[]'] : [formData['description[]']];
    const quantities = Array.isArray(formData['quantity[]']) ? formData['quantity[]'] : [formData['quantity[]']];
    const amounts = Array.isArray(formData['amount[]']) ? formData['amount[]'] : [formData['amount[]']];

    // Add each row of table data to the Excel sheet
    for (let i = 0; i < items.length; i++) {
        const rowData = [
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            items[i], accountAssignmentCategories[i], materialCodes[i], descriptions[i], quantities[i], amounts[i],
            formData.partnerFunction, formData.assetNumber
        ];
        sheet.addRow(rowData);
    }
 

    // Define the file path for saving
    const filePath = path.join('F:', 'PR form', 'pr_form_data.xlsx');

    // Function to save workbook with retry logic
    function saveWorkbookWithRetry(retries) {
        workbook.xlsx.writeFile(filePath)
            .then(() => {
                console.log('Excel file saved successfully.');
                res.sendFile(filePath); // Optionally, you can send the file back to the client
            })
            .catch((error) => {
                if (error.code === 'EBUSY' && retries > 0) {
                    console.error('Resource busy, retrying...');
                    setTimeout(() => saveWorkbookWithRetry(retries - 1), 1000); // Retry after 1 second
                } else {
                    console.error('Error saving Excel file:', error);
                    res.status(500).send('Failed to save Excel file.');
                }
            });
    }

    // Start the save process with up to 3 retries
    saveWorkbookWithRetry(3);
});

// Welcome message for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the PR Form Submission App');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
