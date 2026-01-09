const pool = require('../../config/db'); 
const { sendEmail } = require('./mail'); 

const handleContactForm = async (req, res) => {
    try {
        const { firstName, email, message } = req.body;

        // 1. Basic Validation
        if (!firstName || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill in all required fields." 
            });
        }

        // 2. Database Logic (Save to Postgres First)
        const insertQuery = `
            INSERT INTO enquiries (first_name, email, message) 
            VALUES ($1, $2, $3) 
            RETURNING id;
        `;
        const values = [firstName, email, message];
        
        // Execute the query
        const dbResult = await pool.query(insertQuery, values);

        // 3. Prepare the Email Content
        const mailOptions = {
            replyTo: email, 
            from: `"${email}" <${process.env.MAIL_USER}>`, 
            subject: `New Project Enquiry from ${firstName}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #42b6e9; margin-top: 0;">New Website Enquiry</h2>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-weight: bold; margin-bottom: 10px;">Message:</p>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
                </div>
            `
        };

        // 4. Send via your mail controller
        await sendEmail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: "Enquiry sent successfully!" 
        });

    } catch (error) {
        console.error("Contact Controller Error:", error);
        
        // If the error happened AFTER the DB save, you might want to log it specifically
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong. Please try again later." 
        });
    }
};

module.exports = { handleContactForm };