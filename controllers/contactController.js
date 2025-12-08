const supabase = require('../config/supabaseClient');

const handleContactForm = async (req, res) => {
    const { name, email, company, project_type, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('folio_contacts')
            .insert([{ name, email, company, project_type, message }]);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while submitting the form.' });
        }

        res.status(200).json({ success: true, message: 'Form submitted successfully!' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

module.exports = { handleContactForm };
