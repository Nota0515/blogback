const pool = require('../config/db');
const crpto = require('crypto');

exports.viewblogs = async (req, res) => {
    try {
        const allblogs = await pool.query("SELECT * FROM blogs ORDER BY created_at LIMIT 20 OFFSET 0");
        if (allblogs.rows.length === 0) return res.status(404).json({ message: "Sorry but there is'nt any blogs yet" });
        const blogdata = allblogs.rows;
        res.status(200).json({ blogdata });
    } catch (error) {
        res.status(500).json({ message: `we are having a server error` })
        console.error('this is the issue', error);
    }
};

exports.sblog = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await pool.query("SELECT * FROM blogs WHERE slug= $1", [slug]);

        if (blog.rows.length === 0) return res.status(404).json({ message: 'Sorry but Blog not found' });
        const spblog = blog.rows[0];
        res.status(200).json({ spblog })
    } catch (error) {
        res.status(500).json({ message: "Internet server error " });
        console.error('this is the issue', error);
    }
};

exports.likedblog = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); //i think personally a transaction is a bettter approach for this whole database interaction 
        const { slug } = req.params;
        const user_ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';

        const identifier = crpto.createHash('sha256').update(user_ip + userAgent).digest('hex');
        const blogidresult = await client.query('Select * FROM blogs WHERE slug = $1', [slug])
        if (blogidresult.rows.length === 0) return res.status(404).json({ message: "blog not found", success: false });
        const blogid = blogidresult.rows[0].id;
        
        const liked = await client.query('INSERT INTO blog_likes (blog_id , user_id ) VALUES ( $1 , $2 ) ON CONFLICT (blog_id , user_id) DO NOTHING RETURNING id', [blogid, identifier]);

        if (liked.rows.length === 0){
            await client.query('ROLLBACK');
            return res.status(409).json({
                message : 'you have already liked my blog',
                success : false 
            })
        };  

        await client.query('UPDATE blogs SET like_count = like_count + 1  WHERE id = $1', [blogid]);


        await client.query('COMMIT');
        res.status(201).json({
            message: 'you liked my blog thankyou',
            success: true
        });

    } catch (error) {
        await client.query('ROLLBACK');

        if (error.code === '23505'){
            res.status(400).json({message : "You already liked my blog" , 
                sucess : false
            })
        }
        res.status(500).json({ message: "internal server error in liked systems" , success: false});
    } finally {
        client.release(); //pran jai per vachan na jai I mean kabhi bhulio matt release kerna when doing tranactions 
    }
};

//data helpers for SSR 
exports.blogs = async()=>{
    try {
        const allblogs = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        return allblogs.rows; 
    } catch (error) {
        console.error("error in helper ftn ", error);
        console.log(error);
        throw error ;
    };
};

exports.thisblog = async (slug) =>{
    try {
        const blog = await pool.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
        if (blog.rows.length === 0){
            return null ;
        }
        return blog.rows[0];
    } catch (error) {
        console.error(error);
        console.log("Error in the thisblog helper ftn",error);
        throw error;
    };
};