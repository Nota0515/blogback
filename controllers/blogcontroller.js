const pool = require('../config/db');

exports.viewblogs = async (req , res ) => {
    try {
        const allblogs = await pool.query("SELECT * FROM blogs ORDER BY created_at LIMIT 20 OFFSET 0");
        if (allblogs.rows.length === 0 ) return res.status(404).json({error : "Sorry but there is'nt any blogs yet" });
        const blogdata = allblogs.rows;
        res.status(200).json({blogdata});
    } catch (error) {
        res.status(500).json({error : `we are having a server error`})
        console.error('this is the issue', error);
    }
};

exports.sblog = async(req , res) => {
    try {
        const { slug } = req.params;
        const blog = await pool.query("SELECT * FROM blogs WHERE slug= $1" , [slug]);
        
        if (blog.rows.length === 0) return res.status(404).json({error : 'Sorry but Blog not found'});
        const spblog = blog.rows[0];
        res.status(200).json({spblog})
    } catch (error) {
        res.status(500).json({error : "INternet server error "});
        console.error('this is the issue', error);
    }
}