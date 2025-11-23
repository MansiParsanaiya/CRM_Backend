const Node = require('../models/nodeModel');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

// exports.createEmployee = async (req, res) => {
//     try {
//         const employee = await Node.create(req.body);
//         res.status(201).json({ data: employee, message: "Employee created successfully" });
//     } catch (error) {
//         console.error('Error creating Employee:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

exports.createEmployee = async (req, res) => {
    try {
        const { employeeName, contactNo } = req.body;

        const employee = await Node.create({ employeeName, contactNo });

        const image = await loadImage("https://img.freepik.com/premium-photo/abstract-white-background-with-smooth_136558-4588.jpg", { imageType: 'image/jpeg' });

        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';

        ctx.fillText(employeeName, 200, 150);
        ctx.fillText(contactNo, 200, 200);

        const base64Image = canvas.toDataURL().split(';base64,').pop();

        res.status(200).json({ data: { base64: base64Image, employeename: employeeName }, message: "Employee created successfully with text added to image" });
    } catch (error) {
        console.error('Error creating Employee and adding text to image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.addTextToImage = async (req, res) => {
    try {
        const { employeeName, contactNo } = req.body;

        // Load image from URL with image type specified
        const image = await loadImage("https://img.freepik.com/premium-photo/abstract-white-background-with-smooth_136558-4588.jpg", { imageType: 'image/jpeg' });

        // Create canvas
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Set font properties
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';

        // Overlay text on image
        ctx.fillText(employeeName, 50, 50); // Adjust position as needed
        ctx.fillText(contactNo, 50, 100);   // Adjust position as needed

        // Convert canvas to base64
        const base64Image = canvas.toDataURL().split(';base64,').pop();

        res.status(200).json({ base64Image });
    } catch (error) {
        console.error('Error adding text to image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getEmployee = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json({ data: nodes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}