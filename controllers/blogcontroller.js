const pool = require('../config/db');
const crpto = require('crypto');

exports.viewblogs = async (req, res) => {
    try {
        const allblogs = await pool.query("SELECT * FROM blogs ORDER BY created_at LIMIT 20 OFFSET 0");
        if (allblogs.rows.length === 0) return res.status(404).json({ error: "Sorry but there is'nt any blogs yet" });
        const blogdata = allblogs.rows;
        res.status(200).json({ blogdata });
    } catch (error) {
        res.status(500).json({ error : `we are having a server error` })
        console.error('this is the issue', error);
    }
};

exports.sblog = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await pool.query("SELECT * FROM blogs WHERE slug= $1", [slug]);

        if (blog.rows.length === 0) return res.status(404).json({ error: 'Sorry but Blog not found' });
        const spblog = blog.rows[0];
        res.status(200).json({ spblog })
    } catch (error) {
        res.status(500).json({ error : "Internet server error " });
        console.error('this is the issue', error);
    }
}

exports.likedblog = async (req, res) => {
    try {
        const { blogid } = req.params;
        const user_ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || req.socket.remoteAddhress;
        const userAgent = req.headers['user-agent'] || '';
        //loggging headers 
        console.log('Headers:', {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-real-ip': req.headers['x-real-ip'],
            'remoteAddress': req.socket.remoteAddress,
        });
        const identifier = crpto.createHash('sha256').update(user_ip + userAgent).digest('hex');

        pool.query('INSERT INTO blog_likes (blog_id , user_id ) VALUES ( $1 , $2 )', [blogid, identifier]);
        pool.query('UPDATE blogs SET like_count = like_count + 1  WHERE id = $1', [blogid]);

        res.status(201).json({
            message : 'you liked my blog thankyou',
            success : true
        });

    } catch (error) {
        res.status(500).json({ error: "internal server error in liked systems" })
        console.error('this is the issue', error);
    }
}